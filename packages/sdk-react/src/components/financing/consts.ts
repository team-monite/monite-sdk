import { components } from '@/api';
import {
  AccessTime,
  CheckCircleOutline,
  PaidOutlined,
  ErrorOutline,
  CancelOutlined,
  BlockOutlined,
} from '@mui/icons-material';
import { type SvgIcon } from '@mui/material';

export const FINANCING_LABEL = 'My Financing';

export const ROW_TO_TAG_FINANCE_STATUS_MUI_MAP: Record<
  components['schemas']['WCInvoiceStatus'],
  string
> = {
  NEW: '#292929',
  DEFAULTED: '#CC394B',
  PAID: '#0DAA8E',
  FUNDED: '#3737FF',
  LATE: '#E27E46',
  REJECTED: '#CC394B',
  DRAFT: '',
};

export const BACKGROUND_FINANCE_STATUS_MUI_MAP: Record<
  components['schemas']['WCInvoiceStatus'],
  string
> = {
  NEW: '#F2F2F2',
  DEFAULTED: '#FFE0E4',
  PAID: '#EEFBF9',
  FUNDED: '#F4F4FE',
  LATE: '#FFF3E9',
  REJECTED: '#FFE0E4',
  DRAFT: '',
};

export const FINANCE_INVOICE_STATUS_TO_MUI_ICON_MAP: Record<
  components['schemas']['WCInvoiceStatus'],
  typeof SvgIcon
> = {
  NEW: AccessTime,
  DEFAULTED: BlockOutlined,
  PAID: PaidOutlined,
  FUNDED: CheckCircleOutline,
  LATE: ErrorOutline,
  REJECTED: CancelOutlined,
  DRAFT: AccessTime,
};
