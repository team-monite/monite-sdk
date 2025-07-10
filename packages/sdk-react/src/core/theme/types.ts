import { components } from '@/api';
import { ChipProps } from '@mui/material';

type TypographyStyle = {
  fontSize?: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
};

export type ThemeConfig = {
  borderRadius?: number;
  spacing?: number;

  colors?: {
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    neutral?: string;

    info?: string;
    success?: string;
    warning?: string;
    error?: string;

    background?: string;

    text?: string;
  };

  typography?: {
    fontFamily?: string;
    fontSize?: number;

    h1?: TypographyStyle;
    h2?: TypographyStyle;
    h3?: TypographyStyle;
    subtitle1?: TypographyStyle;
    subtitle2?: TypographyStyle;
    body1?: TypographyStyle;
    body2?: TypographyStyle;
  };

  components?: {
    invoiceStatusChip?: Partial<MoniteInvoiceStatusChipProps>;
    payableStatusChip?: Partial<MonitePayableStatusChipProps>;
    approvalRequestStatusChip?: Partial<MoniteApprovalRequestStatusChipProps>;
    invoiceRecurrenceStatusChip?: Partial<MoniteInvoiceRecurrenceStatusChipProps>;
    invoiceRecurrenceIterationStatusChip?: Partial<MoniteInvoiceRecurrenceIterationStatusChipProps>;
    counterpartStatusChip?: Partial<MoniteCounterpartStatusChipProps>;
    approvalStatusChip?: Partial<MoniteApprovalStatusChipProps>;
  };
};

export type MonitePalette = {
  primary: {
    dark: string;
    main: string;
    light: string;
    '30': string;
    '40': string;
    '50': string;
    '60': string;
    '80': string;
    '90': string;
  };
  secondary: {
    main: string;
    dark: string;
  };
  neutral: {
    '10': string;
    '50': string;
    '70': string;
    '80': string;
    '90': string;
    '95': string;
  };
  info: {
    main: string;
    light: string;
    dark: string;
  };
  success: {
    main: string;
    light: string;
    dark: string;
  };
  warning: {
    main: string;
    light: string;
    dark: string;
  };
  error: {
    main: string;
    light: string;
    dark: string;
  };
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  divider: string;
  status: {
    draft: string;
    new: string;
    approve_in_progress: string;
    paid: string;
    waiting_to_be_paid: string;
    rejected: string;
    partially_paid: string;
    canceled: string;
    all: string;
  };
};

interface BaseChipProps {
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
}

interface BaseStatusChipProps extends BaseChipProps {
  /** Display status icon? */
  icon?: boolean;
}

export type MoniteCounterpartType = 'customer' | 'vendor';

export interface MoniteInvoiceStatusChipProps extends BaseStatusChipProps {
  /** The status of the invoice. */
  status: components['schemas']['ReceivablesStatusEnum'];
}

export interface MoniteInvoiceRecurrenceStatusChipProps
  extends BaseStatusChipProps {
  /** The status of the recurrence. */
  status: components['schemas']['RecurrenceStatus'];
}

export interface MoniteInvoiceRecurrenceIterationStatusChipProps
  extends BaseStatusChipProps {
  /** The status of the iteration. */
  status: components['schemas']['IterationStatus'];
}

export interface MonitePayableStatusChipProps extends BaseStatusChipProps {
  /** The status of the payable. */
  status: components['schemas']['PayableStateEnum'];
}

export interface MoniteCounterpartStatusChipProps extends BaseChipProps {
  /** The status of the invoice. */
  status: MoniteCounterpartType;
}

export interface MoniteApprovalRequestStatusChipProps
  extends BaseStatusChipProps {
  /** The status of the approval request. */
  status: components['schemas']['ApprovalRequestStatus'];
}

export interface MoniteApprovalStatusChipProps extends BaseStatusChipProps {
  /** The status of the payable. */
  status: components['schemas']['ApprovalPolicyStatus'];
}
