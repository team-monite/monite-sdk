import { components } from '@/api';
import { I18n } from '@lingui/core';

import {
  getApprovalRuleLabel,
  mapApprovalStatusToPayableStatus,
} from './approvalStepUtils';
import { ApprovalCall, ApprovalStep } from './buildApprovalSteps';

export function createApprovalStep({
  stepNumber,
  assignees,
  roleIds,
  userApprovalCall,
  roleApprovalCall,
  requests,
  i18n,
  isRoleBased,
}: {
  stepNumber: number;
  assignees: string[];
  roleIds: string[];
  userApprovalCall: ApprovalCall | undefined;
  roleApprovalCall: ApprovalCall | undefined;
  requests: ApprovalRequest[];
  i18n: I18n;
  isRoleBased: boolean;
}): ApprovalStep {
  const stepRequests = requests.filter((req) => {
    if (isRoleBased && roleIds.length > 0) {
      return (
        req.role_ids?.length > 0 &&
        roleIds.some((roleId) => req.role_ids!.includes(roleId))
      );
    }
    return (
      req.user_ids?.length > 0 &&
      assignees.some((userId) => req.user_ids!.includes(userId))
    );
  });

  const stepStatus: components['schemas']['ApprovalRequestStatus'] =
    stepRequests.length > 0 ? stepRequests[0].status : 'waiting';

  return {
    stepNumber,
    type: getApprovalRuleLabel(userApprovalCall, roleApprovalCall, i18n),
    assignee: undefined,
    assignees: isRoleBased ? [] : assignees,
    roleIds: isRoleBased ? roleIds : [],
    status: stepStatus,
    payableStatus: mapApprovalStatusToPayableStatus(stepStatus),
    isRoleBased,
  };
}

export function createConcurrentApprovalSteps({
  stepNumber,
  assignees,
  roleIds,
  userApprovalCall,
  roleApprovalCall,
  requests,
  i18n,
}: {
  stepNumber: number;
  assignees: string[];
  roleIds: string[];
  userApprovalCall: ApprovalCall | undefined;
  roleApprovalCall: ApprovalCall | undefined;
  requests: ApprovalRequest[];
  i18n: I18n;
}): ApprovalStep[] {
  const steps: ApprovalStep[] = [];

  if (assignees.length > 0) {
    steps.push(
      createApprovalStep({
        stepNumber,
        assignees,
        roleIds: [],
        userApprovalCall,
        roleApprovalCall,
        requests,
        i18n,
        isRoleBased: false,
      })
    );
  }

  if (roleIds.length > 0) {
    steps.push(
      createApprovalStep({
        stepNumber,
        assignees: [],
        roleIds,
        userApprovalCall,
        roleApprovalCall,
        requests,
        i18n,
        isRoleBased: true,
      })
    );
  }

  return steps;
}

type ApprovalRequest =
  components['schemas']['ApprovalRequestResourceWithMetadata'];
