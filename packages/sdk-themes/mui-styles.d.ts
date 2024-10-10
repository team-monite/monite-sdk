import { type MoniteApprovalRequestStatusChipProps } from '@monite/sdk-react/src/components/approvalRequests/ApprovalRequestsTable/ApprovalRequestStatusChip/ApprovalRequestStatusChip';
import { type MoniteCounterpartStatusChipProps } from '@monite/sdk-react/src/components/counterparts/CounterpartStatusChip';
import { type MonitePayableDetailsInfoProps } from '@monite/sdk-react/src/components/payables/PayableDetails/PayableDetailsForm';
import { type MonitePayableTableProps } from '@monite/sdk-react/src/components/payables/PayablesTable/types';
import { type MonitePayableStatusChipProps } from '@monite/sdk-react/src/components/payables/PayableStatusChip/PayableStatusChip';
import { type MoniteInvoiceRecurrenceIterationStatusChipProps } from '@monite/sdk-react/src/components/receivables/InvoiceRecurrenceIterationStatusChip/InvoiceRecurrenceIterationStatusChip';
import { type MoniteInvoiceRecurrenceStatusChipProps } from '@monite/sdk-react/src/components/receivables/InvoiceRecurrenceStatusChip/InvoiceRecurrenceStatusChip';
import { type MoniteInvoiceStatusChipProps } from '@monite/sdk-react/src/components/receivables/InvoiceStatusChip/InvoiceStatusChip';
import { type MoniteTablePaginationProps } from '@monite/sdk-react/src/ui/table/TablePagination';
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
  styleOverrides?: any;
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
    MonitePayableTable: 'never';
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
  }
}
