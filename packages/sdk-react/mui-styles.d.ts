import { MoniteApprovalStatusChipProps } from '@/components/approvalPolicies/ApprovalStatusChip/ApprovalStatusChip';
import { type MoniteApprovalRequestStatusChipProps } from '@/components/approvalRequests/ApprovalRequestsTable/ApprovalRequestStatusChip';
import { type MoniteCounterpartStatusChipProps } from '@/components/counterparts/CounterpartStatusChip';
import { type MonitePayableDetailsInfoProps } from '@/components/payables/PayableDetails/PayableDetailsForm';
import { MonitePayableTableProps } from '@/components/payables/PayablesTable/types';
import { type MonitePayableStatusChipProps } from '@/components/payables/PayableStatusChip/PayableStatusChip';
import { type MoniteInvoiceRecurrenceIterationStatusChipProps } from '@/components/receivables/InvoiceRecurrenceIterationStatusChip/InvoiceRecurrenceIterationStatusChip';
import { type MoniteInvoiceRecurrenceStatusChipProps } from '@/components/receivables/InvoiceRecurrenceStatusChip/InvoiceRecurrenceStatusChip';
import { type MoniteInvoiceStatusChipProps } from '@/components/receivables/InvoiceStatusChip/InvoiceStatusChip';
import { MoniteReceivablesTableProps } from '@/components/receivables/ReceivablesTable/ReceivablesTable';
import { type MoniteTablePaginationProps } from '@/ui/table/TablePagination';
import {
  ComponentsOverrides,
  ComponentsPropsList,
  ComponentsVariants,
  Theme as MuiTheme,
} from '@mui/material/styles';

type Theme = Omit<MuiTheme, 'components'>;

/**
 * Extends theme `components` with Monite components,
 * allowing to configure default props, style overrides, and variants.
 */
interface ComponentType<T extends keyof ComponentsPropsList> {
  defaultProps?: ComponentsPropsList[T];
  styleOverrides?: ComponentsOverrides<Theme>[T];
  variants?: ComponentsVariants[T];
}

declare module '@mui/material/styles' {
  /**
   * Extends `styleOverrides` of the component theme configuration
   * with slots from the component.
   */
  interface ComponentNameToClassKey {
    MoniteInvoiceStatusChip: 'root';
    MonitePayableStatusChip: 'root';
    MoniteApprovalRequestStatusChip: 'root';
    MoniteTablePagination: 'root' | 'menu';
    MonitePayableDetailsInfo: 'never';
    MoniteInvoiceRecurrenceStatusChip: 'root';
    MoniteInvoiceRecurrenceIterationStatusChip: 'root';
    MoniteCounterpartStatusChip: 'root';
    MoniteApprovalStatusChip: 'root';
    MonitePayableTable: 'never';
    MoniteReceivablesTable: 'never';
  }

  /**
   * Extends MUI component list
   */
  interface ComponentsPropsList {
    MoniteInvoiceStatusChip: Partial<MoniteInvoiceStatusChipProps>;
    MonitePayableStatusChip: Partial<MonitePayableStatusChipProps>;
    MoniteApprovalRequestStatusChip: Partial<MoniteApprovalRequestStatusChipProps>;
    MoniteTablePagination: Partial<MoniteTablePaginationProps>;
    MonitePayableDetailsInfo: Partial<MonitePayableDetailsInfoProps>;
    MoniteInvoiceRecurrenceStatusChip: Partial<MoniteInvoiceRecurrenceStatusChipProps>;
    MoniteInvoiceRecurrenceIterationStatusChip: Partial<MoniteInvoiceRecurrenceIterationStatusChipProps>;
    MoniteCounterpartStatusChip: Partial<MoniteCounterpartStatusChipProps>;
    MonitePayableTable: Partial<MonitePayableTableProps>;
    MoniteApprovalStatusChip: Partial<MoniteApprovalStatusChipProps>;
    MoniteReceivablesTable: Partial<MoniteReceivablesTableProps>;
  }

  interface MoniteOptions {
    dateFormat?: Intl.DateTimeFormatOptions;
    dateTimeFormat?: Intl.DateTimeFormatOptions;
  }

  /**
   * Extends theme `components`
   */
  interface Components {
    MoniteOptions?: { defaultProps: MoniteOptions };
    MoniteInvoiceStatusChip?: ComponentType<'MoniteInvoiceStatusChip'>;
    MonitePayableStatusChip?: ComponentType<'MonitePayableStatusChip'>;
    MoniteApprovalRequestStatusChip?: ComponentType<'MoniteApprovalRequestStatusChip'>;
    MoniteTablePagination?: ComponentType<'MoniteTablePagination'>;
    MonitePayableDetailsInfo?: ComponentType<'MonitePayableDetailsInfo'>;
    MonitePayableTable?: ComponentType<'MonitePayableTable'>;
    MoniteInvoiceRecurrenceStatusChip?: ComponentType<'MoniteInvoiceRecurrenceStatusChip'>;
    MoniteInvoiceRecurrenceIterationStatusChip?: ComponentType<'MoniteInvoiceRecurrenceIterationStatusChip'>;
    MoniteCounterpartStatusChip?: ComponentType<'MoniteCounterpartStatusChip'>;
    MoniteApprovalStatusChip?: ComponentType<'MoniteApprovalStatusChip'>;
    MoniteReceivablesTable?: ComponentType<'MoniteReceivablesTable'>;
  }
}
