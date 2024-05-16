import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { PayableStateEnum } from '@monite/sdk-api';
import CancelIcon from '@mui/icons-material/Cancel';
import Contrast from '@mui/icons-material/Contrast';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
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
  [PayableStateEnum.WAITING_TO_BE_PAID]: HourglassEmptyIcon,
  [PayableStateEnum.REJECTED]: DangerousOutlinedIcon,
  [PayableStateEnum.DRAFT]: InsertDriveFileOutlinedIcon,
  [PayableStateEnum.PARTIALLY_PAID]: Contrast,
  [PayableStateEnum.PAID]: PaidOutlinedIcon,
  [PayableStateEnum.CANCELED]: CancelIcon,
};
