import { components } from '@/api';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import StarHalfOutlinedIcon from '@mui/icons-material/StarHalfOutlined';
import { ChipTypeMap, type SvgIcon } from '@mui/material';

export const ROW_TO_TAG_STATUS_MUI_MAP: Record<
  | components['schemas']['ReceivablesStatusEnum']
  | components['schemas']['WCInvoiceStatus'],
  ChipTypeMap['props']['color']
> = {
  draft: 'default',
  issuing: 'default',
  issued: 'primary',
  failed: 'error',
  accepted: 'success',
  partially_paid: 'info',
  paid: 'success',
  expired: 'warning',
  uncollectible: 'warning',
  canceled: 'error',
  recurring: 'info',
  declined: 'error',
  overdue: 'warning',
  deleted: 'error',
  NEW: 'default',
  DEFAULTED: 'default',
  PAID: 'success',
  FUNDED: 'success',
  LATE: 'warning',
  REJECTED: 'error',
};

export const INVOICE_STATUS_TO_MUI_ICON_MAP: Record<
  | components['schemas']['ReceivablesStatusEnum']
  | components['schemas']['WCInvoiceStatus'],
  typeof SvgIcon
> = {
  draft: InsertDriveFileOutlinedIcon,
  issuing: InsertDriveFileOutlinedIcon,
  issued: SendOutlinedIcon,
  failed: ErrorOutlineOutlinedIcon,
  accepted: CheckOutlinedIcon,
  partially_paid: StarHalfOutlinedIcon,
  paid: PaidOutlinedIcon,
  expired: HourglassBottomOutlinedIcon,
  uncollectible: BlockOutlinedIcon,
  canceled: CancelIcon,
  recurring: ReplayOutlinedIcon,
  declined: DangerousOutlinedIcon,
  overdue: ErrorOutlineOutlinedIcon,
  deleted: DeleteIcon,
  NEW: InsertDriveFileOutlinedIcon,
  DEFAULTED: InsertDriveFileOutlinedIcon,
  PAID: PaidOutlinedIcon,
  FUNDED: PaidOutlinedIcon,
  LATE: HourglassBottomOutlinedIcon,
  REJECTED: CancelIcon,
};

// eslint-disable-next-line lingui/no-unlocalized-strings
export const INVOICE_DOCUMENT_AUTO_ID = 'INV-auto';

export const CREATE_INVOICE = 'Create invoice';

export const FILTER_TYPE_SEARCH = 'search' as const;
