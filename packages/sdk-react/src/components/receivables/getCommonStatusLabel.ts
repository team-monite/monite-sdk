import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { components } from '@monite/sdk-api/src/api';

export const getCommonStatusLabel = (
  i18n: I18n,
  status: components['schemas']['ReceivablesStatusEnum']
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
    default:
      throw new Error(`Unknown status ${JSON.stringify(status)}`);
  }
};
