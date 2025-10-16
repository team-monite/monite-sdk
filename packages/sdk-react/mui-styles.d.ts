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
  Palette,
} from '@mui/material/styles';

type Theme = Omit<MuiTheme, 'components'> & {
  palette: Palette & {
    status: {
      [key: string]: string;
    };
  };
};

declare module '@mui/material/styles' {
  /**
   * Augment PaletteColor to include numeric shade keys and foreground used by Monite
   */
  interface PaletteColor {
    '10'?: string;
    '20'?: string;
    '25'?: string;
    '30'?: string;
    '40'?: string;
    '50'?: string;
    '55'?: string;
    '60'?: string;
    '65'?: string;
    '75'?: string;
    '80'?: string;
    '85'?: string;
    '90'?: string;
    '95'?: string;
    '100'?: string;
    foreground?: {
      main: string;
    };
  }

  interface Palette {
    neutral: {
      main: string;
      '10': string;
      '30': string;
      '50': string;
      '70': string;
      '80': string;
      '90': string;
      '95': string;
    };
    primary: {
      main: string;
      '10': string;
      '20': string;
      '30': string;
      '40': string;
      '50': string;
      '55': string;
      '60': string;
      '65': string;
      '80': string;
      '85': string;
      '90': string;
      '95': string;
      foreground: {
        main: string;
      };
    };
    success: {
      main: string;
      '10': string;
      '30': string;
      '50': string;
      '60': string;
      '80': string;
      '90': string;
      '95': string;
    };
    warning: {
      main: string;
      '10': string;
      '30': string;
      '50': string;
      '60': string;
      '80': string;
      '90': string;
      '95': string;
    };
    error: {
      main: string;
      '10': string;
      '25': string;
      '50': string;
      '75': string;
      '100': string;
    };
    status: {
      [key: string]: string;
    };
  }
  interface PaletteOptions {
    neutral?: {
      main?: string;
      '10'?: string;
      '30'?: string;
      '50'?: string;
      '70'?: string;
      '80'?: string;
      '90'?: string;
      '95'?: string;
    };
    primary?: {
      main?: string;
      '10'?: string;
      '20'?: string;
      '30'?: string;
      '40'?: string;
      '50'?: string;
      '55'?: string;
      '60'?: string;
      '65'?: string;
      '80'?: string;
      '85'?: string;
      '90'?: string;
      '95'?: string;
      foreground?: {
        main?: string;
      };
    };
    success?: {
      main?: string;
      '10'?: string;
      '30'?: string;
      '50'?: string;
      '60'?: string;
      '80'?: string;
      '90'?: string;
      '95'?: string;
    };
    warning?: {
      main?: string;
      '10'?: string;
      '30'?: string;
      '50'?: string;
      '60'?: string;
      '80'?: string;
      '90'?: string;
      '95'?: string;
    };
    error?: {
      main?: string;
      '10'?: string;
      '25'?: string;
      '50'?: string;
      '75'?: string;
      '100'?: string;
    };
    status?: {
      [key: string]: string;
    };
  }

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
    /**
     * Custom styles container for Tailwind button customization.
     * This property is not processed by MUI's createTheme but is preserved
     * for use in getTailwindTheme() to generate CSS variables.
     */
    styles?: import('@/core/theme/types').ThemeConfig['components']['styles'];
  }
}

/**
 * Extends theme `components` with Monite components,
 * allowing to configure default props, style overrides, and variants.
 */
interface ComponentType<T extends keyof ComponentsPropsList> {
  defaultProps?: ComponentsPropsList[T];
  styleOverrides?: ComponentsOverrides<Theme>[T];
  variants?: ComponentsVariants[T];
}
