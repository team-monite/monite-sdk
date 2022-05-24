import { createContext, useContext } from 'react';

import { createTheme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';
import { Palette } from '@mui/material/styles/createPalette';
import { Theme, ThemeOptions } from '@mui/material/styles/createTheme';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import type {} from '@mui/x-data-grid/themeAugmentation';

const palette = {
  neutral50: '#707070',
  primary50: '#246FFF',
};

export const defaultMoniteTypography:
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

export const defaultMoniteComponents: Components<Omit<Theme, 'components'>> = {
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
        color: palette.neutral50,
      },
    },
    defaultProps: {
      autoHeight: true,
      hideFooterSelectedRowCount: true,
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
          color: palette.neutral50,
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
};

export const defaultMoniteLightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: palette.primary50,
    },
    secondary: {
      main: palette.neutral50,
    },
  },
  typography: defaultMoniteTypography,
  components: defaultMoniteComponents,
};

export const defaultMoniteLightTheme = createTheme(
  defaultMoniteLightThemeOptions
);

export const MoniteThemeContext = createContext<ThemeOptions>(
  defaultMoniteLightThemeOptions
);

export function useMoniteThemeContext(): Theme {
  const moniteThemeContext = useContext(MoniteThemeContext);

  if (!moniteThemeContext) {
    throw new Error(
      'Could not find MoniteThemeContext. Make sure that you are using "MoniteThemeProvider" component before calling this hook.'
    );
  }

  return createTheme(moniteThemeContext);
}
