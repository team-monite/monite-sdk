import { components } from '@/api';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { ScriptStep } from './buildApprovalSteps';

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
  approvalCalls: NonNullable<ScriptStep['all']>
): NonNullable<ScriptStep['all']>[0] | undefined =>
  approvalCalls.find(
    (call) => call.call === APPROVAL_CALL_TYPES.REQUEST_APPROVAL_BY_USERS
  );

export const findRoleApprovalCall = (
  approvalCalls: NonNullable<ScriptStep['all']>
): NonNullable<ScriptStep['all']>[0] | undefined =>
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
  userApprovalCall: NonNullable<ScriptStep['all']>[0] | null,
  roleApprovalCall: NonNullable<ScriptStep['all']>[0] | null,
  i18n: I18n
): string => {
  if (userApprovalCall?.params) {
    const { user_ids, required_approval_count } = userApprovalCall.params;

    if (user_ids?.length === 1) {
      return t(i18n)`Single user`;
    }

    if (user_ids && user_ids.length > 1) {
      return required_approval_count === 1
        ? t(i18n)`Any user from the list`
        : t(i18n)`Any ${required_approval_count} users from the list`;
    }
  }

  if (roleApprovalCall?.params) {
    return t(i18n)`Any user with role`;
  }

  return '';
};
