import {
  ReceivablesStatusEnum,
  QuoteStateEnum,
  CreditNoteStateEnum,
} from '@team-monite/sdk-api';
import { TagColorType } from '@team-monite/ui-kit-react';

export const ROW_TO_TAG_STATUS_MAP: Record<
  ReceivablesStatusEnum | QuoteStateEnum | CreditNoteStateEnum,
  TagColorType
> = {
  [ReceivablesStatusEnum.DRAFT]: 'secondary',
  [ReceivablesStatusEnum.ISSUED]: 'primary',
  [ReceivablesStatusEnum.ACCEPTED]: 'success',
  [ReceivablesStatusEnum.PARTIALLY_PAID]: 'special',
  [ReceivablesStatusEnum.PAID]: 'success',
  [ReceivablesStatusEnum.EXPIRED]: 'warning',
  [ReceivablesStatusEnum.UNCOLLECTIBLE]: 'warning',
  [ReceivablesStatusEnum.CANCELED]: 'error',
  [ReceivablesStatusEnum.DELETED]: 'error',
  [ReceivablesStatusEnum.RECURRING]: 'disabled',
  [QuoteStateEnum.DECLINED]: 'error',
  [ReceivablesStatusEnum.OVERDUE]: 'warning',
};
