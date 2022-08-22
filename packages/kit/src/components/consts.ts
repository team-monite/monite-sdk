import { PayableStateEnum } from '@monite/js-sdk';
import { TagColorType } from '@monite/ui';

export const ROW_TO_TAG_STATUS_MAP: Record<PayableStateEnum, TagColorType> = {
  [PayableStateEnum.NEW]: 'draft',
  [PayableStateEnum.APPROVE_IN_PROGRESS]: 'pending',
  [PayableStateEnum.WAITING_TO_BE_PAID]: 'pending',
  [PayableStateEnum.PAID]: 'success',
  [PayableStateEnum.CANCELED]: 'warning',
  [PayableStateEnum.REJECTED]: 'warning',
};

export const PAYABLE_TAB_LIST = ['document', 'payment', 'status', 'history'];
