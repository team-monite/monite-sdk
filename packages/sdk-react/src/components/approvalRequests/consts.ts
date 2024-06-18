import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { ApprovalRequestStatus } from '@monite/sdk-api';
import CancelIcon from '@mui/icons-material/Cancel';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { ChipTypeMap, type SvgIcon } from '@mui/material';

export const ROW_TO_STATUS_MUI_MAP: {
  [key in ApprovalRequestStatus]: ChipTypeMap['props']['color'];
} = {
  [ApprovalRequestStatus.APPROVED]: 'success',
  [ApprovalRequestStatus.CANCELED]: 'secondary',
  [ApprovalRequestStatus.REJECTED]: 'error',
  [ApprovalRequestStatus.WAITING]: 'warning',
};

export const APPROVAL_REQUEST_STATUS_TO_MUI_ICON_MAP: Record<
  ApprovalRequestStatus,
  typeof SvgIcon
> = {
  [ApprovalRequestStatus.APPROVED]: PaidOutlinedIcon,
  [ApprovalRequestStatus.CANCELED]: CancelIcon,
  [ApprovalRequestStatus.REJECTED]: DangerousOutlinedIcon,
  [ApprovalRequestStatus.WAITING]: HourglassEmptyIcon,
};

export const getRowToStatusTextMap = (
  i18n: I18n
): {
  [key in ApprovalRequestStatus]: string;
} => ({
  [ApprovalRequestStatus.APPROVED]: t(i18n)`Approved`,
  [ApprovalRequestStatus.CANCELED]: t(i18n)`Canceled`,
  [ApprovalRequestStatus.REJECTED]: t(i18n)`Rejected`,
  [ApprovalRequestStatus.WAITING]: t(i18n)`In Approval`,
});

export const FILTER_TYPE_STATUS = 'status';
export const FILTER_TYPE_CREATED_AT = 'created_at';
export const FILTER_TYPE_CURRENT_USER = 'created_by';
