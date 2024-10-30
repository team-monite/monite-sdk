import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { components } from '@monite/sdk-api/src/api';

type ApprovalRequestStatus = components['schemas']['ApprovalRequestStatus'];

export const getRowToStatusTextMap = (
  i18n: I18n
): {
  [key in ApprovalRequestStatus]: string;
} => ({
  approved: t(i18n)`Approved`,
  canceled: t(i18n)`Canceled`,
  rejected: t(i18n)`Rejected`,
  waiting: t(i18n)`In Approval`,
});
