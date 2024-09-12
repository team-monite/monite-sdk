import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

export const getRowToStatusTextMap = (
  i18n: I18n
): {
  [key in components['schemas']['PayableStateEnum']]: string;
} => ({
  draft: t(i18n)`Draft`,
  new: t(i18n)`New`,
  approve_in_progress: t(i18n)`In Approval`,
  paid: t(i18n)`Paid`,
  waiting_to_be_paid: t(i18n)`Approved`,
  rejected: t(i18n)`Rejected`,
  partially_paid: t(i18n)`Partially Paid`,
  canceled: t(i18n)`Canceled`,
});
