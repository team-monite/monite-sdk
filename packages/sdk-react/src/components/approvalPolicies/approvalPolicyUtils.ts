import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import {
  getSharedApprovalRuleLabel,
  getUsersFromListLabel,
} from './shared/approvalRuleLabels';
import type { Rules } from './types';

export type { Rules, ApprovalPolicyScriptType } from './types';

export const APPROVAL_POLICY_RULE_TYPES = {
  SINGLE_USER: 'single_user' as const,
  USERS_FROM_LIST: 'users_from_list' as const,
  ROLES_FROM_LIST: 'roles_from_list' as const,
  APPROVAL_CHAIN: 'approval_chain' as const,
} as const;

/* eslint-disable lingui/no-unlocalized-strings */
export const APPROVAL_REQUEST_CALLS = {
  REQUEST_APPROVAL_BY_USERS:
    'ApprovalRequests.request_approval_by_users' as const,
  REQUEST_APPROVAL_BY_ROLES:
    'ApprovalRequests.request_approval_by_roles' as const,
} as const;
/* eslint-enable lingui/no-unlocalized-strings */

export type ApprovalRequestCall = typeof APPROVAL_REQUEST_CALLS;
export type ApprovalRequestCallValues =
  ApprovalRequestCall[keyof ApprovalRequestCall];

export const getRuleName = (
  ruleType: string,
  i18n: I18n
): string | undefined => {
  switch (ruleType) {
    case APPROVAL_POLICY_RULE_TYPES.SINGLE_USER:
      return t(i18n)`Single user`;
    case APPROVAL_POLICY_RULE_TYPES.USERS_FROM_LIST:
      return t(i18n)`Users from the list`;
    case APPROVAL_POLICY_RULE_TYPES.ROLES_FROM_LIST:
      return t(i18n)`Roles from the list`;
    case APPROVAL_POLICY_RULE_TYPES.APPROVAL_CHAIN:
      return t(i18n)`Approval chain`;
    default:
      return undefined;
  }
};

export const getRuleLabel = (
  ruleKey: keyof Rules,
  i18n: I18n,
  value?: number
): string | undefined => {
  switch (ruleKey) {
    case APPROVAL_POLICY_RULE_TYPES.SINGLE_USER:
      return getSharedApprovalRuleLabel.singleUser(i18n);
    case APPROVAL_POLICY_RULE_TYPES.USERS_FROM_LIST:
      return getUsersFromListLabel(i18n, value);
    case APPROVAL_POLICY_RULE_TYPES.ROLES_FROM_LIST:
      return getSharedApprovalRuleLabel.anyUserWithRole(i18n);
    case APPROVAL_POLICY_RULE_TYPES.APPROVAL_CHAIN:
      return getSharedApprovalRuleLabel.allUsersFromList(i18n);
    default:
      return undefined;
  }
};
