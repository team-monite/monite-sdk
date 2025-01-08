import {
  type MoniteApprovalRequestStatusChipProps,
  type MoniteApprovalStatusChipProps,
  type MoniteCounterpartStatusChipProps,
  type MoniteInvoiceRecurrenceIterationStatusChipProps,
  type MoniteInvoiceRecurrenceStatusChipProps,
  type MoniteInvoiceStatusChipProps,
  type MonitePayableStatusChipProps,
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
    MoniteInvoiceRecurrenceStatusChip: 'root';
    MoniteInvoiceRecurrenceIterationStatusChip: 'root';
    MoniteCounterpartStatusChip: 'root';
    MoniteApprovalStatusChip: 'root';
  }

  /**
   * Extends MUI component list
   */
  interface ComponentsPropsList {
    MoniteInvoiceStatusChip: Partial<MoniteInvoiceStatusChipProps>;
    MonitePayableStatusChip: Partial<MonitePayableStatusChipProps>;
    MoniteApprovalRequestStatusChip: Partial<MoniteApprovalRequestStatusChipProps>;
    MoniteInvoiceRecurrenceStatusChip: Partial<MoniteInvoiceRecurrenceStatusChipProps>;
    MoniteInvoiceRecurrenceIterationStatusChip: Partial<MoniteInvoiceRecurrenceIterationStatusChipProps>;
    MoniteCounterpartStatusChip: Partial<MoniteCounterpartStatusChipProps>;
    MoniteApprovalStatusChip: Partial<MoniteApprovalStatusChipProps>;
  }

  /**
   * Extends theme `components`
   */
  interface Components {
    MoniteInvoiceStatusChip?: ComponentType<'MoniteInvoiceStatusChip'>;
    MonitePayableStatusChip?: ComponentType<'MonitePayableStatusChip'>;
    MoniteApprovalRequestStatusChip?: ComponentType<'MoniteApprovalRequestStatusChip'>;
    MoniteInvoiceRecurrenceStatusChip?: ComponentType<'MoniteInvoiceRecurrenceStatusChip'>;
    MoniteInvoiceRecurrenceIterationStatusChip?: ComponentType<'MoniteInvoiceRecurrenceIterationStatusChip'>;
    MoniteCounterpartStatusChip?: ComponentType<'MoniteCounterpartStatusChip'>;
    MoniteApprovalStatusChip?: ComponentType<'MoniteApprovalStatusChip'>;
  }
}
