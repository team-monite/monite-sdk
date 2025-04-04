import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

export const getCommonStatusLabel = (
  i18n: I18n,
  status:
    | components['schemas']['ReceivablesStatusEnum']
    | components['schemas']['WCInvoiceStatus']
) => {
  switch (status) {
    case 'draft':
      return t(i18n)`Draft`;
    case 'issued':
      return t(i18n)`Issued`;
    case 'accepted':
      return t(i18n)`Accepted`;
    case 'expired':
      return t(i18n)`Expired`;
    case 'declined':
      return t(i18n)`Declined`;
    case 'recurring':
      return t(i18n)`Recurring`;
    case 'partially_paid':
      return t(i18n)`Partially Paid`;
    case 'paid':
      return t(i18n)`Paid`;
    case 'overdue':
      return t(i18n)`Overdue`;
    case 'uncollectible':
      return t(i18n)`Uncollectible`;
    case 'canceled':
      return t(i18n)`Canceled`;
    case 'deleted':
      return t(i18n)`Deleted`;
    case 'NEW':
      return t(i18n)`New`;
    case 'DEFAULTED':
      return t(i18n)`Defaulted`;
    case 'PAID':
      return t(i18n)`Paid`;
    case 'FUNDED':
      return t(i18n)`Funded`;
    case 'LATE':
      return t(i18n)`Late`;
    case 'REJECTED':
      return t(i18n)`Rejected`;
    default:
      throw new Error(`Unknown status ${JSON.stringify(status)}`);
  }
};
