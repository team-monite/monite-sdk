import { components, Services } from '@/api';
import { ChipProps, SelectProps } from '@mui/material';

type TypographyStyle = {
  fontSize?: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
};

export type ThemeConfig = {
  borderRadius?: number;
  spacing?: number;

  colors?: {
    primary?: string;
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
};

export type MonitePalette = {
  primary: {
    dark: string;
    main: string;
    light: string;
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
};

interface MoniteTablePaginationRootSlotProps {
  pageSizeOptions?: number[];
}

interface MoniteTablePaginationSlotProps {
  slotProps?: {
    pageSizeSelect?: Omit<
      SelectProps,
      'value' | 'defaultValue' | 'aria-label' | 'ref' | 'components'
    >;
  };
}

export interface MoniteTablePaginationProps
  extends MoniteTablePaginationSlotProps,
    MoniteTablePaginationRootSlotProps {}

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

export type PayablesTabFilter = NonNullable<
  Services['payables']['getPayables']['types']['parameters']['query']
>;

//TODO: better to map it with schema.json keyof values
export type FieldValueTypes =
  | 'document_id'
  | 'counterpart_id'
  | 'created_at'
  | 'issued_at'
  | 'due_date'
  | 'status'
  | 'amount'
  | 'pay';

export interface MonitePayableTableProps {
  isShowingSummaryCards?: boolean;
  fieldOrder?: FieldValueTypes[];
  summaryCardFilters?: Record<string, PayablesTabFilter | null>;
}

export type OptionalFields = {
  invoiceDate?: boolean;
  tags?: boolean;
};

export type OcrRequiredField =
  | 'currency'
  | 'invoiceDate'
  | 'counterpart'
  | 'invoiceNumber'
  | 'counterpartBankAccount'
  | 'document_issued_at_date'
  | 'dueDate'
  | 'tags'
  | 'counterpartName'
  | 'contactPerson'
  | 'issueDate'
  | 'amount'
  | 'appliedPolicy'
  | 'addedByUser'
  | 'addedOn'
  | 'updatedOn';

export type OcrRequiredFields =
  | Partial<Record<OcrRequiredField, boolean>>
  | undefined;

export type OcrMismatchField =
  | keyof Pick<
      components['schemas']['PayableResponseSchema'],
      'amount_to_pay' | 'counterpart_bank_account_id'
    >;

export type OcrMismatchFields =
  | Partial<Record<OcrMismatchField, boolean>>
  | undefined;

export interface MonitePayableDetailsInfoProps {
  optionalFields?: OptionalFields;
  ocrRequiredFields?: OcrRequiredFields;
  ocrMismatchFields?: OcrMismatchFields;
  isTagsDisabled?: boolean;
}
