import { InvoiceStatusChipProps } from '@/components/receivables/InvoicesTable/InvoiceStatusChip';
import {
  ComponentsOverrides,
  ComponentsVariants,
  Theme as MuiTheme,
} from '@mui/material/styles';

type Theme = Omit<MuiTheme, 'components'>;

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey {
    MoniteInvoiceStatusChip: 'root';
  }

  interface ComponentsPropsList {
    MoniteInvoiceStatusChip: Partial<InvoiceStatusChipProps>;
  }

  interface Components {
    MoniteInvoiceStatusChip?: {
      defaultProps?: ComponentsPropsList['MoniteInvoiceStatusChip'];
      styleOverrides?: ComponentsOverrides<Theme>['MoniteInvoiceStatusChip'];
      variants?: ComponentsVariants['MoniteInvoiceStatusChip'];
    };
  }
}
