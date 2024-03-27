import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { PayableStateEnum } from '@monite/sdk-api';
import { ChipTypeMap } from '@mui/material';

export const ROW_TO_STATUS_MUI_MAP: {
  [key in PayableStateEnum]: ChipTypeMap['props']['color'];
} = {
  [PayableStateEnum.DRAFT]: 'default',
  [PayableStateEnum.NEW]: 'default',
  [PayableStateEnum.APPROVE_IN_PROGRESS]: 'warning',
  [PayableStateEnum.WAITING_TO_BE_PAID]: 'info',
  [PayableStateEnum.PARTIALLY_PAID]: 'success',
  [PayableStateEnum.PAID]: 'success',
  [PayableStateEnum.CANCELED]: 'error',
  [PayableStateEnum.REJECTED]: 'error',
};

export const getRowToStatusTextMap = (
  i18n: I18n
): {
  [key in PayableStateEnum]: string;
} => ({
  [PayableStateEnum.DRAFT]: t(i18n)`Draft`,
  [PayableStateEnum.NEW]: t(i18n)`New`,
  [PayableStateEnum.APPROVE_IN_PROGRESS]: t(i18n)`Pending`,
  [PayableStateEnum.WAITING_TO_BE_PAID]: t(i18n)`Waiting to be paid`,
  [PayableStateEnum.PARTIALLY_PAID]: t(i18n)`Partially paid`,
  [PayableStateEnum.PAID]: t(i18n)`Paid`,
  [PayableStateEnum.CANCELED]: t(i18n)`Canceled`,
  [PayableStateEnum.REJECTED]: t(i18n)`Rejected`,
});

export const PAYABLE_TAB_LIST = [
  'document',
  'payment' /*, 'status', 'history' */,
];
