import { components } from '@/api';
import { I18n } from '@lingui/core';

import {
  mapApprovalStatusToPayableStatus,
  getApprovalRuleLabel,
  findUserApprovalCall,
  findRoleApprovalCall,
  filterRequestsByRoles,
  filterRequestsByUsers,
} from './approvalStepUtils';
import { ScriptStep, ApprovalStep } from './buildApprovalSteps';

type ApprovalRequest =
  components['schemas']['ApprovalRequestResourceWithMetadata'];

export interface EnhancedApprovalStep extends ApprovalStep {
  actualAssignees: string[];
  hasActiveRequests: boolean;
  requestIds: string[];
}

export class ApprovalStepResolver {
  constructor(
    private policyScript: ScriptStep[],
    private requests: ApprovalRequest[]
  ) {}

  private resolveStepAssignees(step: ScriptStep): {
    assignees: string[];
    roleIds: string[];
    actualAssignees: string[];
    relatedRequests: ApprovalRequest[];
  } {
    const approvalCalls = step.all || [];

    const userApprovalCall = findUserApprovalCall(approvalCalls);
    const roleApprovalCall = findRoleApprovalCall(approvalCalls);

    let assignees: string[] = [];
    let roleIds: string[] = [];
    let actualAssignees: string[] = [];
    let relatedRequests: ApprovalRequest[] = [];

    if (userApprovalCall?.params?.user_ids) {
      assignees = userApprovalCall.params.user_ids;
    }

    if (roleApprovalCall?.params?.role_ids) {
      roleIds = roleApprovalCall.params.role_ids;
    }

    const isRoleBased = roleIds.length > 0 && assignees.length === 0;

    if (isRoleBased) {
      relatedRequests = filterRequestsByRoles(this.requests, roleIds);
    } else {
      relatedRequests = filterRequestsByUsers(this.requests, assignees, true);
    }

    if (assignees.length === 0 && !isRoleBased) {
      const userIds = relatedRequests.flatMap((req) => req.user_ids || []);
      actualAssignees = [...new Set(userIds)];
    } else {
      actualAssignees = assignees;
    }

    return {
      assignees,
      roleIds,
      actualAssignees,
      relatedRequests,
    };
  }

  buildCompleteSteps(i18n: I18n): EnhancedApprovalStep[] {
    const approvalSteps: EnhancedApprovalStep[] = [];

    this.policyScript.forEach((scriptStep, stepIndex) => {
      const approvalCalls = scriptStep.all || [];

      const userApprovalCall = findUserApprovalCall(approvalCalls);
      const roleApprovalCall = findRoleApprovalCall(approvalCalls);

      const { assignees, roleIds, actualAssignees, relatedRequests } =
        this.resolveStepAssignees(scriptStep);

      if (
        scriptStep.run_concurrently &&
        assignees.length > 0 &&
        roleIds.length > 0
      ) {
        const userRequests = relatedRequests.filter(
          (req) => req.user_ids && req.user_ids.length > 0
        );
        const userStepStatus: components['schemas']['ApprovalRequestStatus'] =
          userRequests.length > 0 ? userRequests[0].status : 'waiting';

        approvalSteps.push({
          stepNumber: stepIndex + 1,
          type: getApprovalRuleLabel(userApprovalCall || null, null, i18n),
          assignee: undefined,
          assignees: assignees,
          roleIds: [],
          status: userStepStatus,
          payableStatus: mapApprovalStatusToPayableStatus(userStepStatus),
          isRoleBased: false,
          actualAssignees: assignees,
          hasActiveRequests: userRequests.length > 0,
          requestIds: userRequests.map((req) => req.id),
        });

        const roleRequests = relatedRequests.filter(
          (req) => req.role_ids && req.role_ids.length > 0
        );
        const roleStepStatus: components['schemas']['ApprovalRequestStatus'] =
          roleRequests.length > 0 ? roleRequests[0].status : 'waiting';

        approvalSteps.push({
          stepNumber: stepIndex + 1,
          type: getApprovalRuleLabel(null, roleApprovalCall || null, i18n),
          assignee: undefined,
          assignees: [],
          roleIds: roleIds,
          status: roleStepStatus,
          payableStatus: mapApprovalStatusToPayableStatus(roleStepStatus),
          isRoleBased: true,
          actualAssignees: [],
          hasActiveRequests: roleRequests.length > 0,
          requestIds: roleRequests.map((req) => req.id),
        });
      } else {
        const isRoleBased = roleIds.length > 0 && assignees.length === 0;
        const stepStatus: components['schemas']['ApprovalRequestStatus'] =
          relatedRequests.length > 0 ? relatedRequests[0].status : 'waiting';

        approvalSteps.push({
          stepNumber: stepIndex + 1,
          type: getApprovalRuleLabel(
            userApprovalCall || null,
            roleApprovalCall || null,
            i18n
          ),
          assignee: undefined,
          assignees: assignees,
          roleIds: roleIds,
          status: stepStatus,
          payableStatus: mapApprovalStatusToPayableStatus(stepStatus),
          isRoleBased: isRoleBased,
          actualAssignees: actualAssignees,
          hasActiveRequests: relatedRequests.length > 0,
          requestIds: relatedRequests.map((req) => req.id),
        });
      }
    });

    return approvalSteps;
  }
}
