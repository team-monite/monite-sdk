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

export interface ScriptStep {
  all?: Array<{
    call: string;
    params?: {
      user_ids?: string[];
      role_ids?: string[];
      required_approval_count?: number;
    };
  }>;
  run_concurrently?: boolean;
}

export interface ApprovalStep {
  stepNumber: number;
  assignees: string[];
  roleIds: string[];
  assignee?: string;
  type: string;
  status: components['schemas']['ApprovalRequestStatus'];
  payableStatus: components['schemas']['PayableStateEnum'];
  isRoleBased: boolean;
}

export function buildApprovalSteps(
  policyScript: ScriptStep[],
  requests: ApprovalRequest[],
  i18n: I18n
): ApprovalStep[] {
  const approvalSteps: ApprovalStep[] = [];

  policyScript.forEach((scriptStep, stepIndex) => {
    const approvalCalls = scriptStep.all || [];

    const userApprovalCall = findUserApprovalCall(approvalCalls);
    const roleApprovalCall = findRoleApprovalCall(approvalCalls);

    let assignees: string[] = [];
    let roleIds: string[] = [];

    if (userApprovalCall?.params?.user_ids) {
      assignees = userApprovalCall.params.user_ids;
    }

    if (roleApprovalCall?.params?.role_ids) {
      roleIds = roleApprovalCall.params.role_ids;
    }

    if (
      scriptStep.run_concurrently &&
      assignees.length > 0 &&
      roleIds.length > 0
    ) {
      const userRequests = requests.filter(
        (req) =>
          req.user_ids?.length > 0 &&
          assignees.some((userId) => req.user_ids!.includes(userId))
      );
      const userStepStatus: components['schemas']['ApprovalRequestStatus'] =
        userRequests.length > 0 ? userRequests[0].status : 'waiting';

      approvalSteps.push({
        stepNumber: stepIndex + 1,
        type: getApprovalRuleLabel(userApprovalCall || null, null, i18n),
        assignee: undefined,
        assignees,
        roleIds: [],
        status: userStepStatus,
        payableStatus: mapApprovalStatusToPayableStatus(userStepStatus),
        isRoleBased: false,
      });

      const roleRequests = requests.filter(
        (req) =>
          req.role_ids?.length > 0 &&
          roleIds.some((roleId) => req.role_ids!.includes(roleId))
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
      });
    } else {
      const isRoleBased = roleIds.length > 0 && assignees.length === 0;
      const stepRequests = isRoleBased
        ? filterRequestsByRoles(requests, roleIds)
        : filterRequestsByUsers(requests, assignees);

      const stepStatus: components['schemas']['ApprovalRequestStatus'] =
        stepRequests.length > 0 ? stepRequests[0].status : 'waiting';

      approvalSteps.push({
        stepNumber: stepIndex + 1,
        type: getApprovalRuleLabel(
          userApprovalCall || null,
          roleApprovalCall || null,
          i18n
        ),
        assignee: undefined,
        assignees,
        roleIds,
        status: stepStatus,
        payableStatus: mapApprovalStatusToPayableStatus(stepStatus),
        isRoleBased,
      });
    }
  });

  return approvalSteps;
}

type ApprovalRequest =
  components['schemas']['ApprovalRequestResourceWithMetadata'];
