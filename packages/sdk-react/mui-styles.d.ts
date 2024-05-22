import { PayableStatusChipProps } from '@/components/payables/PayableStatusChip/PayableStatusChip';
import { InvoiceStatusChipProps } from '@/components/receivables/InvoiceStatusChip/InvoiceStatusChip';
import { MoniteTablePaginationProps } from '@/ui/table/TablePagination';
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
    MoniteTablePagination: 'root' | 'menu';
  }

  interface ComponentsPropsList {
    MoniteInvoiceStatusChip: Partial<InvoiceStatusChipProps>;
    MonitePayableStatusChip: Partial<PayableStatusChipProps>;
    MoniteTablePagination: Partial<MoniteTablePaginationProps>;
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

    MoniteTablePagination?: {
      defaultProps?: ComponentsPropsList['MoniteTablePagination'];
      styleOverrides?: ComponentsOverrides<Theme>['MoniteTablePagination'];
      variants?: ComponentsVariants['MoniteTablePagination'];
    };
  }
}
