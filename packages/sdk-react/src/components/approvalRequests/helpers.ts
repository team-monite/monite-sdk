import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { ApprovalRequestStatus } from './types';

export const getRowToStatusTextMap = (
  i18n: I18n
): {
  [key in ApprovalRequestStatus]: string;
} => ({
  [ApprovalRequestStatus.APPROVED]: t(i18n)`Approved`,
  [ApprovalRequestStatus.CANCELED]: t(i18n)`Canceled`,
  [ApprovalRequestStatus.REJECTED]: t(i18n)`Rejected`,
  [ApprovalRequestStatus.WAITING]: t(i18n)`In Approval`,
});
