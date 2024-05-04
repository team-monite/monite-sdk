import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { PayableStateEnum } from '@monite/sdk-api';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import StarHalfOutlinedIcon from '@mui/icons-material/StarHalfOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import { ChipTypeMap, type SvgIcon } from '@mui/material';

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

export const PAYABLE_STATUS_TO_MUI_ICON_MAP: Record<
  PayableStateEnum,
  typeof SvgIcon
> = {
  [PayableStateEnum.NEW]: TaskOutlinedIcon,
  [PayableStateEnum.APPROVE_IN_PROGRESS]: ScheduleOutlinedIcon,
  [PayableStateEnum.WAITING_TO_BE_PAID]: CheckOutlinedIcon,
  [PayableStateEnum.REJECTED]: DangerousOutlinedIcon,
  [PayableStateEnum.DRAFT]: InsertDriveFileOutlinedIcon,
  [PayableStateEnum.PARTIALLY_PAID]: StarHalfOutlinedIcon, // not match to https://fonts.google.com/icons?selected=Material+Symbols+Outlined:radio_button_partial:FILL@0;wght@400;GRAD@0;opsz@24&icon.size=24&icon.color=%235f6368
  [PayableStateEnum.PAID]: PaidOutlinedIcon,
  [PayableStateEnum.CANCELED]: CancelIcon, // not match to https://fonts.google.com/icons?selected=Material+Symbols+Outlined:scan_delete:FILL@0;wght@400;GRAD@0;opsz@24&icon.size=24&icon.color=%235f6368
};

export const PAYABLE_TAB_LIST = [
  'document',
  'payment' /*, 'status', 'history' */,
];
