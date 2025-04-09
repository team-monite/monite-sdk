import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

export const getCommonStatusLabel = (
  i18n: I18n,
  status: components['schemas']['WCInvoiceStatus']
) => {
  switch (status) {
    case 'NEW':
      return t(i18n)`In review`;
    case 'DEFAULTED':
      return t(i18n)`Uncollectible`;
    case 'PAID':
      return t(i18n)`Paid in full`;
    case 'FUNDED':
      return t(i18n)`Funded`;
    case 'LATE':
      return t(i18n)`Late payment`;
    case 'REJECTED':
      return t(i18n)`Rejected`;
    default:
      throw new Error(`Unknown status ${JSON.stringify(status)}`);
  }
};
