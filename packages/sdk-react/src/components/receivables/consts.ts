import {
  CreditNoteStateEnum,
  QuoteStateEnum,
  ReceivablesStatusEnum,
} from '@monite/sdk-api';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import StarHalfOutlinedIcon from '@mui/icons-material/StarHalfOutlined';
import { ChipTypeMap, type SvgIcon } from '@mui/material';

export const ROW_TO_TAG_STATUS_MUI_MAP: Record<
  ReceivablesStatusEnum | QuoteStateEnum | CreditNoteStateEnum,
  ChipTypeMap['props']['color']
> = {
  [ReceivablesStatusEnum.DRAFT]: 'default',
  [ReceivablesStatusEnum.ISSUED]: 'primary',
  [ReceivablesStatusEnum.ACCEPTED]: 'success',
  [ReceivablesStatusEnum.PARTIALLY_PAID]: 'info',
  [ReceivablesStatusEnum.PAID]: 'success',
  [ReceivablesStatusEnum.EXPIRED]: 'warning',
  [ReceivablesStatusEnum.UNCOLLECTIBLE]: 'warning',
  [ReceivablesStatusEnum.CANCELED]: 'error',
  [ReceivablesStatusEnum.DELETED]: 'error',
  [ReceivablesStatusEnum.RECURRING]: 'warning',
  [QuoteStateEnum.DECLINED]: 'error',
  [ReceivablesStatusEnum.OVERDUE]: 'warning',
};

export const INVOICE_STATUS_TO_MUI_ICON_MAP: Record<
  ReceivablesStatusEnum | QuoteStateEnum | CreditNoteStateEnum,
  typeof SvgIcon
> = {
  [ReceivablesStatusEnum.DRAFT]: InsertDriveFileOutlinedIcon,
  [ReceivablesStatusEnum.ISSUED]: SendOutlinedIcon, // doesn't match 100% to https://fonts.google.com/icons?selected=Material+Symbols+Outlined:send:FILL@0;wght@400;GRAD@0;opsz@24&icon.size=24&icon.color=%235f6368
  [ReceivablesStatusEnum.ACCEPTED]: CheckOutlinedIcon,
  [ReceivablesStatusEnum.PARTIALLY_PAID]: StarHalfOutlinedIcon, // doesn't match to https://fonts.google.com/icons?selected=Material+Symbols+Outlined:radio_button_partial:FILL@0;wght@400;GRAD@0;opsz@24&icon.size=24&icon.color=%235f6368
  [ReceivablesStatusEnum.PAID]: PaidOutlinedIcon,
  [ReceivablesStatusEnum.EXPIRED]: HourglassBottomOutlinedIcon, // doesn't match 100% to https://fonts.google.com/icons?selected=Material+Symbols+Outlined:hourglass_bottom:FILL@0;wght@400;GRAD@0;opsz@24&icon.size=24&icon.color=%235f6368
  [ReceivablesStatusEnum.UNCOLLECTIBLE]: BlockOutlinedIcon,
  [ReceivablesStatusEnum.CANCELED]: CancelIcon, // doesn't match to https://fonts.google.com/icons?selected=Material+Symbols+Outlined:scan_delete:FILL@0;wght@400;GRAD@0;opsz@24&icon.size=24&icon.color=%235f6368
  [ReceivablesStatusEnum.DELETED]: DeleteOutlineOutlinedIcon, // doesn't match 100% to https://fonts.google.com/icons?selected=Material+Symbols+Outlined:delete:FILL@0;wght@400;GRAD@0;opsz@24&icon.size=24&icon.color=%235f6368
  [ReceivablesStatusEnum.RECURRING]: ReplayOutlinedIcon,
  [QuoteStateEnum.DECLINED]: DangerousOutlinedIcon,
  [ReceivablesStatusEnum.OVERDUE]: ErrorOutlineOutlinedIcon,
};

export const FILTER_TYPE_SEARCH = 'search';
export const FILTER_TYPE_STATUS = 'status';
export const FILTER_TYPE_CUSTOMER = 'customer';
