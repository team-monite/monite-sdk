import { components } from '@/api';
import {
  getSharedApprovalRuleLabel,
  getUsersFromListLabel,
} from '@/components/approvalPolicies/shared/approvalRuleLabels';
import type { I18n } from '@lingui/core';

import { type ApprovalCall } from './buildApprovalSteps';

type ApprovalRequest =
  components['schemas']['ApprovalRequestResourceWithMetadata'];

export const APPROVAL_CALL_TYPES = {
  REQUEST_APPROVAL_BY_USERS: 'ApprovalRequests.request_approval_by_users',
  REQUEST_APPROVAL_BY_ROLES: 'ApprovalRequests.request_approval_by_roles',
} as const;

export const mapApprovalStatusToPayableStatus = (
  status: components['schemas']['ApprovalRequestStatus']
): components['schemas']['PayableStateEnum'] => {
  switch (status) {
    case 'approved':
      return 'waiting_to_be_paid';
    case 'rejected':
      return 'rejected';
    case 'canceled':
      return 'canceled';
    case 'waiting':
    default:
      return 'approve_in_progress';
  }
};

export const findUserApprovalCall = (
  approvalCalls: ApprovalCall[]
): ApprovalCall | undefined =>
  approvalCalls.find(
    (call) => call.call === APPROVAL_CALL_TYPES.REQUEST_APPROVAL_BY_USERS
  );

export const findRoleApprovalCall = (
  approvalCalls: ApprovalCall[]
): ApprovalCall | undefined =>
  approvalCalls.find(
    (call) => call.call === APPROVAL_CALL_TYPES.REQUEST_APPROVAL_BY_ROLES
  );

export const filterRequestsByRoles = (
  requests: ApprovalRequest[],
  roleIds: string[]
): ApprovalRequest[] => {
  return requests.filter(
    (req) =>
      req.role_ids?.length > 0 &&
      roleIds.some((roleId) => req.role_ids!.includes(roleId))
  );
};

export const filterRequestsByUsers = (
  requests: ApprovalRequest[],
  userIds: string[],
  allowEmptyUserIds: boolean = false
): ApprovalRequest[] =>
  requests.filter(
    (req) =>
      req.user_ids?.length > 0 &&
      ((allowEmptyUserIds && userIds.length === 0) ||
        userIds.some((userId) => req.user_ids!.includes(userId)))
  );

export const getApprovalRuleLabel = (
  userApprovalCall: ApprovalCall | undefined,
  roleApprovalCall: ApprovalCall | undefined,
  i18n: I18n
): string => {
  if (userApprovalCall?.params) {
    const { user_ids, required_approval_count } = userApprovalCall.params;

    if (user_ids?.length === 1) {
      return getSharedApprovalRuleLabel.singleUser(i18n);
    }

    return getUsersFromListLabel(i18n, required_approval_count);
  }

  if (roleApprovalCall?.params) {
    return getSharedApprovalRuleLabel.anyUserWithRole(i18n);
  }

  return '';
};
