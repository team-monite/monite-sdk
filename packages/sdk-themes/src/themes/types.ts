import { components } from '@monite/sdk-react/src/api';
import { ChipProps, SelectProps } from '@mui/material';

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

export interface MoniteInvoiceStatusChipProps {
  icon?: boolean;
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
  /** Display status icon? */
  /** The status of the invoice. */
  status: components['schemas']['ReceivablesStatusEnum'];
  /** The variant of the Chip. */
}

export interface MoniteInvoiceRecurrenceStatusChipProps {
  /** The status of the recurrence. */
  status: components['schemas']['RecurrenceStatus'];
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
  /** Display status icon? */
  icon?: boolean;
}

export interface MoniteInvoiceRecurrenceIterationStatusChipProps {
  /** The status of the iteration. */
  status: components['schemas']['IterationStatus'];
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
  /** Display status icon? */
  icon?: boolean;
}

export interface MonitePayableStatusChipProps {
  /** The status of the payable. */
  status: components['schemas']['PayableStateEnum'];
  /** Display status icon? */
  icon?: boolean;
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
}

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
  summaryCardFilters?: any;
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

// export type PayablesTabFilter = NonNullable<
//   API['payables']['getPayables']['types']['parameters']['query']
// >;

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

export interface MoniteApprovalStatusChipProps {
  /** The status of the payable. */
  status: components['schemas']['ApprovalPolicyStatus'];
  /** Display status icon? */
  icon?: boolean;
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
}

type ApprovalRequestStatus = components['schemas']['ApprovalRequestStatus'];

export interface MoniteApprovalRequestStatusChipProps {
  /** The status of the approval request. */
  status: ApprovalRequestStatus;
  /** The size of the Chip. */
  icon?: boolean;
  /** Display status icon? */
  variant?: ChipProps['variant'];
  /** The variant of the Chip. */
  size?: ChipProps['size'];
}

export type MoniteCounterpartType = 'customer' | 'vendor';

export interface MoniteCounterpartStatusChipProps {
  /** The status of the invoice. */
  status: MoniteCounterpartType;
  /** The variant of the Chip. */
  variant?: ChipProps['variant'];
  /** The size of the Chip. */
  size?: ChipProps['size'];
}
