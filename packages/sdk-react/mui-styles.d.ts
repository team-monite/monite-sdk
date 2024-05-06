import { PayableStatusChipProps } from '@/components/payables/PayablesTable/PayableStatusChip';
import { InvoiceStatusChipProps } from '@/components/receivables/InvoiceStatusChip/InvoiceStatusChip';
import {
  ComponentsOverrides,
  ComponentsVariants,
  Theme as MuiTheme,
} from '@mui/material/styles';

type Theme = Omit<MuiTheme, 'components'>;

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey {
    MoniteInvoiceStatusChip: 'root';
    MonitePayableStatusChip: 'root';
  }

  interface ComponentsPropsList {
    MoniteInvoiceStatusChip: Partial<InvoiceStatusChipProps>;
    MonitePayableStatusChip: Partial<PayableStatusChipProps>;
  }

  interface Components {
    MoniteInvoiceStatusChip?: {
      defaultProps?: ComponentsPropsList['MoniteInvoiceStatusChip'];
      styleOverrides?: ComponentsOverrides<Theme>['MoniteInvoiceStatusChip'];
      variants?: ComponentsVariants['MoniteInvoiceStatusChip'];
    };

    MonitePayableStatusChip?: {
      defaultProps?: ComponentsPropsList['MonitePayableStatusChip'];
      styleOverrides?: ComponentsOverrides<Theme>['MonitePayableStatusChip'];
      variants?: ComponentsVariants['MonitePayableStatusChip'];
    };
  }
}
