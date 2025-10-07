import type {
  PaginationLayout,
  PaginationPosition,
} from './TablePagination.types';
import type {
  ComponentsOverrides,
  ComponentsProps,
} from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey {
    MoniteTablePagination: 'root' | 'pageSizeSelect';
  }

  interface Components {
    MoniteTablePagination?: {
      defaultProps?: Partial<ComponentsProps['MoniteTablePagination']>;
      styleOverrides?: ComponentsOverrides['MoniteTablePagination'];
    };
  }

  interface ComponentsPropsList {
    MoniteTablePagination: {
      paginationLayout?: PaginationLayout;
      navigationPosition?: PaginationPosition;
      pageSizePosition?: PaginationPosition;
      pageSizeOptions?: number[];
    };
  }
}
