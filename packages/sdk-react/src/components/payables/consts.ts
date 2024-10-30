import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { components } from '@monite/sdk-api/src/api';
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
  [key in components['schemas']['PayableStateEnum']]: ChipTypeMap['props']['color'];
} = {
  draft: 'default',
  new: 'default',
  approve_in_progress: 'warning',
  waiting_to_be_paid: 'success',
  partially_paid: 'success',
  paid: 'success',
  canceled: 'error',
  rejected: 'error',
};

export const getRowToStatusTextMap = (
  i18n: I18n
): {
  [key in components['schemas']['PayableStateEnum']]: string;
} => ({
  draft: t(i18n)`Draft`,
  new: t(i18n)`New`,
  approve_in_progress: t(i18n)`In Approval`,
  paid: t(i18n)`Paid`,
  waiting_to_be_paid: t(i18n)`Approved`,
  rejected: t(i18n)`Rejected`,
  partially_paid: t(i18n)`Partially Paid`,
  canceled: t(i18n)`Canceled`,
});

export const PAYABLE_STATUS_TO_MUI_ICON_MAP: Record<
  components['schemas']['PayableStateEnum'],
  typeof SvgIcon
> = {
  new: TaskOutlinedIcon,
  approve_in_progress: ScheduleOutlinedIcon,
  waiting_to_be_paid: HourglassEmptyIcon,
  rejected: DangerousOutlinedIcon,
  draft: InsertDriveFileOutlinedIcon,
  partially_paid: Contrast,
  paid: PaidOutlinedIcon,
  canceled: CancelIcon,
};
