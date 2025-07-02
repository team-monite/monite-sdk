import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

export const getSharedApprovalRuleLabel = {
  singleUser: (i18n: I18n) => t(i18n)`Single user`,
  anyUserFromList: (i18n: I18n) => t(i18n)`Any user from the list`,
  anyUsersFromList: (i18n: I18n, count: number) =>
    t(i18n)`Any ${count.toString()} users from the list`,
  anyUserWithRole: (i18n: I18n) => t(i18n)`Any user with role`,
  allUsersFromList: (i18n: I18n) => t(i18n)`All users from list, one by one`,
} as const;

export const getUsersFromListLabel = (i18n: I18n, count = 0): string => {
  return count === 1
    ? getSharedApprovalRuleLabel.anyUserFromList(i18n)
    : getSharedApprovalRuleLabel.anyUsersFromList(i18n, count);
};
