import { components } from '@/api';
import CancelIcon from '@mui/icons-material/Cancel';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { ChipTypeMap, type SvgIcon } from '@mui/material';

type ApprovalRequestStatus = components['schemas']['ApprovalRequestStatus'];

export const APPROVAL_REQUEST_STATUSES: readonly ApprovalRequestStatus[] = [
  'waiting',
  'approved',
  'rejected',
  'canceled',
] as const;

export const ROW_TO_STATUS_MUI_MAP: {
  [key in ApprovalRequestStatus]: ChipTypeMap['props']['color'];
} = {
  approved: 'success',
  canceled: 'secondary',
  rejected: 'error',
  waiting: 'warning',
};

export const APPROVAL_REQUEST_STATUS_TO_MUI_ICON_MAP: Record<
  ApprovalRequestStatus,
  typeof SvgIcon
> = {
  approved: PaidOutlinedIcon,
  canceled: CancelIcon,
  rejected: DangerousOutlinedIcon,
  waiting: HourglassEmptyIcon,
};

export const FILTER_TYPE_STATUS = 'status';
export const FILTER_TYPE_CREATED_AT = 'created_at';
export const FILTER_TYPE_ADDED_BY = 'created_by';
export const FILTER_TYPE_CURRENT_USER = 'current_user';
