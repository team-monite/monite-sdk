import {
  ComponentsOverrides,
  ComponentsPropsList,
  ComponentsVariants,
  Theme as MuiTheme,
} from '@mui/material/styles';

/**
 * TODO: Currently, we are using relative paths without aliases because the
 * TypeScript configuration is unable to resolve aliases.
 *
 * Note: The path must exactly match the location of the interface,
 * otherwise it will be treated as `any` in `monite.ts`.
 * It should not target index.ts or exported files, only exact location;
 */
import { type MoniteApprovalStatusChipProps } from './src/components/approvalPolicies/ApprovalStatusChip/ApprovalStatusChip';
import { type MoniteApprovalRequestStatusChipProps } from './src/components/approvalRequests/ApprovalRequestsTable/ApprovalRequestStatusChip/ApprovalRequestStatusChip';
import { type MoniteCounterpartStatusChipProps } from './src/components/counterparts/CounterpartStatusChip/CounterpartStatusChip';
import { type MonitePayableDetailsInfoProps } from './src/components/payables/PayableDetails/PayableDetailsForm/helpers';
import { type MonitePayableTableProps } from './src/components/payables/PayablesTable/types';
import { type MonitePayableStatusChipProps } from './src/components/payables/PayableStatusChip/PayableStatusChip';
import { type MoniteInvoiceRecurrenceIterationStatusChipProps } from './src/components/receivables/InvoiceRecurrenceIterationStatusChip/InvoiceRecurrenceIterationStatusChip';
import { type MoniteInvoiceRecurrenceStatusChipProps } from './src/components/receivables/InvoiceRecurrenceStatusChip/InvoiceRecurrenceStatusChip';
import { type MoniteInvoiceStatusChipProps } from './src/components/receivables/InvoiceStatusChip/InvoiceStatusChip';
import { type MoniteTablePaginationProps } from './src/ui/table/TablePagination';

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
  }
}
