import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

export const tagCategories = [
  'document_type',
  'department',
  'project',
  'cost_center',
  'vendor_type',
  'payment_method',
  'approval_status',
] as const;

export type TagCategory = (typeof tagCategories)[number];

const getTagCategoryLabels = (i18n: I18n): Record<TagCategory, string> => ({
  document_type: t(i18n)`Document Type`,
  department: t(i18n)`Department`,
  project: t(i18n)`Project`,
  cost_center: t(i18n)`Cost Center`,
  vendor_type: t(i18n)`Vendor Type`,
  payment_method: t(i18n)`Payment Method`,
  approval_status: t(i18n)`Approval Status`,
});

export function getTagCategoryLabel(
  category: TagCategory | undefined,
  i18n: I18n
): string {
  if (!category) return '';
  return getTagCategoryLabels(i18n)[category];
}
