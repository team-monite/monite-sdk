import {
  type MoniteApprovalRequestStatusChipProps,
  type MoniteApprovalStatusChipProps,
  type MoniteCounterpartStatusChipProps,
  type MoniteInvoiceRecurrenceIterationStatusChipProps,
  type MoniteInvoiceRecurrenceStatusChipProps,
  type MoniteInvoiceStatusChipProps,
  type MonitePayableDetailsInfoProps,
  type MonitePayableStatusChipProps,
  type MonitePayableTableProps,
} from '@/core/theme/types';
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
    MonitePayableDetailsInfo: Partial<MonitePayableDetailsInfoProps>;
    MoniteInvoiceRecurrenceStatusChip: Partial<MoniteInvoiceRecurrenceStatusChipProps>;
    MoniteInvoiceRecurrenceIterationStatusChip: Partial<MoniteInvoiceRecurrenceIterationStatusChipProps>;
    MoniteCounterpartStatusChip: Partial<MoniteCounterpartStatusChipProps>;
    MonitePayableTable: Partial<MonitePayableTableProps>;
    MoniteApprovalStatusChip: Partial<MoniteApprovalStatusChipProps>;
    MoniteReceivablesTable: Partial<MoniteReceivablesTableProps>;
  }

  /**
   * Extends theme `components`
   */
  interface Components {
    MoniteInvoiceStatusChip?: ComponentType<'MoniteInvoiceStatusChip'>;
    MonitePayableStatusChip?: ComponentType<'MonitePayableStatusChip'>;
    MoniteApprovalRequestStatusChip?: ComponentType<'MoniteApprovalRequestStatusChip'>;
    MonitePayableDetailsInfo?: ComponentType<'MonitePayableDetailsInfo'>;
    MonitePayableTable?: ComponentType<'MonitePayableTable'>;
    MoniteInvoiceRecurrenceStatusChip?: ComponentType<'MoniteInvoiceRecurrenceStatusChip'>;
    MoniteInvoiceRecurrenceIterationStatusChip?: ComponentType<'MoniteInvoiceRecurrenceIterationStatusChip'>;
    MoniteCounterpartStatusChip?: ComponentType<'MoniteCounterpartStatusChip'>;
    MoniteApprovalStatusChip?: ComponentType<'MoniteApprovalStatusChip'>;
    MoniteReceivablesTable?: ComponentType<'MoniteReceivablesTable'>;
  }
}
