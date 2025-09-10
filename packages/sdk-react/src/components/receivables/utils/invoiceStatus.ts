import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

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

export const getCommonRecurrenceStatusLabel = (
    i18n: I18n,
    status: components['schemas']['RecurrenceStatus']
  ) => {
    switch (status) {
      case 'active':
        return t(i18n)`Active`;
      case 'paused':
        return t(i18n)`Paused`;
      case 'canceled':
        return t(i18n)`Canceled`;
      case 'completed':
        return t(i18n)`Completed`;
      default:
        throw new Error(`Unknown status ${JSON.stringify(status)}`);
    }
};

export const getCommonRecurrenceIterationStatusLabel = (
    i18n: I18n,
    status: components['schemas']['IterationStatus']
  ) => {
    switch (status) {
      case 'pending':
        return t(i18n)`Scheduled`;
      case 'skipped':
        return t(i18n)`Skipped`;
      case 'canceled':
        return t(i18n)`Canceled`;
      case 'issue_failed':
        return t(i18n)`Issue failed`;
      case 'send_failed':
        return t(i18n)`Send failed`;
      case 'completed':
        return t(i18n)`Completed`;
      default:
        throw new Error(`Unknown status ${JSON.stringify(status)}`);
    }
};