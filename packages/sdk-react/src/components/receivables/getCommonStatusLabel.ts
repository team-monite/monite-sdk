import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { ReceivablesStatusEnum } from '@monite/sdk-api';

export const getCommonStatusLabel = (
  value: ReceivablesStatusEnum,
  i18n: I18n
) => {
  switch (value) {
    case ReceivablesStatusEnum.DRAFT:
      return t(i18n)`Draft`;
    case ReceivablesStatusEnum.ISSUED:
      return t(i18n)`Issued`;
    case ReceivablesStatusEnum.ACCEPTED:
      return t(i18n)`Accepted`;
    case ReceivablesStatusEnum.EXPIRED:
      return t(i18n)`Expired`;
    case ReceivablesStatusEnum.DECLINED:
      return t(i18n)`Declined`;
    case ReceivablesStatusEnum.RECURRING:
      return t(i18n)`Recurring`;
    case ReceivablesStatusEnum.PARTIALLY_PAID:
      return t(i18n)`Partially Paid`;
    case ReceivablesStatusEnum.PAID:
      return t(i18n)`Paid`;
    case ReceivablesStatusEnum.OVERDUE:
      return t(i18n)`Overdue`;
    case ReceivablesStatusEnum.UNCOLLECTIBLE:
      return t(i18n)`Uncollectible`;
    case ReceivablesStatusEnum.CANCELED:
      return t(i18n)`Canceled`;
    case ReceivablesStatusEnum.DELETED:
      return t(i18n)`Deleted`;
    default:
      throw new Error(`Unknown status ${JSON.stringify(value)}`);
  }
};
