import {
  ReceivablesStatusEnum,
  QuoteStateEnum,
  CreditNoteStateEnum,
} from '@monite/sdk-api';
import { ChipTypeMap } from '@mui/material';

export const ROW_TO_TAG_STATUS_MUI_MAP: Record<
  ReceivablesStatusEnum | QuoteStateEnum | CreditNoteStateEnum,
  ChipTypeMap['props']['color']
> = {
  [ReceivablesStatusEnum.DRAFT]: 'default',
  [ReceivablesStatusEnum.ISSUED]: 'primary',
  [ReceivablesStatusEnum.ACCEPTED]: 'success',
  [ReceivablesStatusEnum.PARTIALLY_PAID]: 'info',
  [ReceivablesStatusEnum.PAID]: 'success',
  [ReceivablesStatusEnum.EXPIRED]: 'warning',
  [ReceivablesStatusEnum.UNCOLLECTIBLE]: 'warning',
  [ReceivablesStatusEnum.CANCELED]: 'error',
  [ReceivablesStatusEnum.DELETED]: 'error',
  [ReceivablesStatusEnum.RECURRING]: 'warning',
  [QuoteStateEnum.DECLINED]: 'error',
  [ReceivablesStatusEnum.OVERDUE]: 'warning',
};

export const FILTER_TYPE_SEARCH = 'search';
export const FILTER_TYPE_STATUS = 'status';
export const FILTER_TYPE_CUSTOMER = 'customer';
