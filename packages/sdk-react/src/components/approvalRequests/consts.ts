import { ExtendedPayableStateEnum } from '@/components/payables/PayablesTable/Filters/SummaryCardsFilters';
import { components } from '@monite/sdk-api/src/api';
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

export const STATUS_TO_MUI_MAP: Record<ExtendedPayableStateEnum, string> = {
  draft: 'text.secondary',
  new: 'primary.main',
  approve_in_progress: 'warning.main',
  paid: 'success.main',
  waiting_to_be_paid: 'primary.main',
  rejected: 'error.main',
  partially_paid: 'secondary.main',
  canceled: 'warning.main',
  all: 'text.primary',
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
