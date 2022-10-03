import { PayableStateEnum } from '@team-monite/sdk-api';
import { TagColorType } from '@team-monite/ui-kit-react';

export const ROW_TO_TAG_STATUS_MAP: Record<PayableStateEnum, TagColorType> = {
  [PayableStateEnum.NEW]: 'primary',
  [PayableStateEnum.APPROVE_IN_PROGRESS]: 'warning',
  [PayableStateEnum.WAITING_TO_BE_PAID]: 'special',
  [PayableStateEnum.PAID]: 'success',
  [PayableStateEnum.CANCELED]: 'error',
  [PayableStateEnum.REJECTED]: 'error',
};

export const PAYABLE_TAB_LIST = [
  'document',
  'payment' /*, 'status', 'history' */,
];
