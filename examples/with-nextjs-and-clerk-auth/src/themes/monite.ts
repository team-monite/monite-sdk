import { grey } from '@mui/material/colors';
import type { Components } from '@mui/material/styles/components.js';
import type {
  Palette,
  PaletteOptions,
} from '@mui/material/styles/createPalette.js';
import type { Theme, ThemeOptions } from '@mui/material/styles/createTheme.js';
import type { TypographyOptions } from '@mui/material/styles/createTypography.js';
import type {} from '@mui/x-data-grid/themeAugmentation';

import { primary } from './colors/monite';

const paletteLight: PaletteOptions = {
  primary: {
    dark: primary['30'],
    main: primary['50'],
    light: primary['95'],
  },
  secondary: {
    main: '#707070',
  },
};

const paletteDark: PaletteOptions = {
  primary: {
    main: '#f5d14d',
    light: '#e1e1ef',
  },
  secondary: {
    main: '#707070',
  },
};

const defaultMoniteTypography:
  | TypographyOptions
  | ((palette: Palette) => TypographyOptions) = {
  fontFamily:
    '"Faktum", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  fontSize: 16,
  fontWeightMedium: 400,
  fontWeightBold: 500,
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  subtitle2: {
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
  },
  caption: {
    fontSize: '1rem',
    fontWeight: 500,
  },
  overline: {
    fontSize: '1.5rem',
    lineHeight: 1,
  },
  button: {
    textTransform: 'none',
    fontWeight: 500,
  },
};

const defaultMoniteComponents: Components<Omit<Theme, 'components'>> = {
  MuiTypography: {
    styleOverrides: {
      subtitle2: {
        fontWeight: 500,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        '& .MuiInputBase-inputAdornedStart': {
          display: 'flex',
          alignItems: 'center',
        },
      },
    },
  },
  MuiDataGrid: {
    styleOverrides: {
      root: {
        fontSize: '1rem',
        '& .MuiDataGrid-footerContainer': {
          justifyContent: 'center',
        },
        '& .MuiDataGrid-cell:focus': {
          outline: 'none',
        },
        '& .MuiDataGrid-row:hover': {
          cursor: 'pointer',
        },
      },
      columnHeaderTitle: {
        fontWeight: 500,
        color: grey[500],
      },
    },
    defaultProps: {
      disableColumnMenu: true,
      density: 'comfortable',
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 10,
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        fontSize: '0.75rem',
      },
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
  },
  MuiCard: {
    defaultProps: {
      variant: 'outlined',
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-head': {
          color: grey[500],
          fontWeight: 500,
        },
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:last-child .MuiTableCell-body': {
          borderBottom: 'none',
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        fontSize: '1rem',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: '1em 1.5em',
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: {
        '&.navigation-list': {
          width: '100%',
          padding: 0,
        },

        '>.MuiCollapse-root': {
          paddingLeft: 28,
        },
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        '&.navigation-list-item': {
          marginBottom: '0.5rem',
          padding: 0,

          '&:last-child': {
            marginBottom: '0',
          },
        },
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        '&.navigation-list-item__button': {
          borderRadius: 6,
          padding: 8,
        },
        '&.Mui-selected': {
          color: primary['50'],
          backgroundColor: primary['90'],
        },
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        '&.navigation-list-item__icon': {
          color: primary['50'],
          marginRight: '0.5rem',
          minWidth: 'auto',
          padding: 0,
        },
      },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      root: {
        '&.navigation-list-item__text > *': {
          padding: 0,
          fontSize: '0.875rem',
          fontStyle: 'normal',
          fontWeight: 500,
        },
      },
    },
  },
};

export const moniteLight: ThemeOptions = {
  palette: {
    mode: 'light',
    ...paletteLight,
  },
  typography: defaultMoniteTypography,
  components: defaultMoniteComponents,
};

export const moniteDark: ThemeOptions = {
  palette: {
    mode: 'dark',
    ...paletteDark,
  },
  typography: defaultMoniteTypography,
  components: defaultMoniteComponents,
};
