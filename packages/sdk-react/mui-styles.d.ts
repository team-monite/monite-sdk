import { type MoniteApprovalRequestStatusChipProps } from '@/components/approvalRequests/ApprovalRequestsTable/ApprovalRequestStatusChip';
import { type PayableStatusChipProps } from '@/components/payables/PayableStatusChip/PayableStatusChip';
import { InvoiceRecurrenceIterationStatusChipProps } from '@/components/receivables/InvoiceRecurrenceIterationStatusChip/InvoiceRecurrenceIterationStatusChip';
import { InvoiceRecurrenceStatusChipProps } from '@/components/receivables/InvoiceRecurrenceStatusChip/InvoiceRecurrenceStatusChip';
import { type InvoiceStatusChipProps } from '@/components/receivables/InvoiceStatusChip';
import { MoniteTablePaginationProps } from '@/ui/table/TablePagination';
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
interface ComponentType<T> {
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
    MoniteInvoiceRecurrenceStatusChip: 'root';
    MoniteInvoiceRecurrenceIterationStatusChip: 'root';
  }

  /**
   * Extends MUI component list
   */
  interface ComponentsPropsList {
    MoniteInvoiceStatusChip: Partial<InvoiceStatusChipProps>;
    MonitePayableStatusChip: Partial<PayableStatusChipProps>;
    MoniteApprovalRequestStatusChip: Partial<MoniteApprovalRequestStatusChipProps>;
    MoniteTablePagination: Partial<MoniteTablePaginationProps>;
    MoniteInvoiceRecurrenceStatusChip: Partial<InvoiceRecurrenceStatusChipProps>;
    MoniteInvoiceRecurrenceIterationStatusChip: Partial<InvoiceRecurrenceIterationStatusChipProps>;
  }

  interface MoniteOptions {
    dateFormat?: Intl.DateTimeFormatOptions;
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
    MoniteInvoiceRecurrenceStatusChip?: ComponentType<'MoniteInvoiceRecurrenceStatusChip'>;
    MoniteInvoiceRecurrenceIterationStatusChip?: ComponentType<'MoniteInvoiceRecurrenceIterationStatusChip'>;
  }
}
