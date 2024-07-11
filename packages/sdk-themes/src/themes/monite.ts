import { grey } from '@mui/material/colors';
import type { Components } from '@mui/material/styles/components.js';
import type {
  Palette,
  PaletteOptions,
} from '@mui/material/styles/createPalette.js';
import type { Theme, ThemeOptions } from '@mui/material/styles/createTheme.js';
import type { TypographyOptions } from '@mui/material/styles/createTypography.js';
import { deepmerge } from '@mui/utils';
import type {} from '@mui/x-data-grid/themeAugmentation';

const primaryLight = {
  dark: '#1D59CC',
  main: '#3737FF',
  light: '#F4F8FF',
  lightest: '#F4F4FE',
};

const primaryDark = {
  dark: '#1D59CC',
  main: '#3737FF',
  light: '#12129E',
  lightest: '#0C0C40',
};

const secondary = {
  main: '#707070',
};

export const neutralLight = {
  '10': '#111111',
  '50': '#707070',
  '80': '#DDDDDD',
};

export const neutralDark = {
  '10': '#FFFFFF',
  '50': '#F3F3F3',
  '80': '#B8B8B8',
};

export const neutralTransparentLight = {
  '50': '#0000008F',
  '80': '#00000021',
  '90': '#0000000D',
};

export const neutralTransparentDark = {
  '50': '#9595958F',
  '80': '#FFFFFF21',
  '90': '#FFFFFF0D',
};

export const paletteLight: PaletteOptions = {
  primary: primaryLight,
  secondary,
};

export const paletteDark: PaletteOptions = {
  primary: primaryDark,
  secondary,
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
    fontStyle: 'normal',
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
  MuiButton: {
    styleOverrides: {
      containedPrimary: {
        padding: '6px 16px',
        height: 40,
        boxShadow: 'none',
        borderRadius: 8,
        fontSize: 16,
        fontWeight: 500,
      },

      root: {
        '&.ThemeSelect': {
          borderRadius: 8,
        },
        '&.ThemeSelect .ThemeSelect-modeLabel': {
          display: 'flex',
        },
      },
    },
  },
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
  MuiTab: {
    styleOverrides: {
      root: {
        position: 'relative',
        fontSize: 14,
        fontWeight: 700,
        marginRight: 24,
        color: neutralTransparentLight['50'],
        padding: '10px 40px',
        borderRadius: 10,
        overflow: 'visible',

        '&:active': {
          backgroundColor: neutralTransparentLight['90'],
        },

        '&:after': {
          position: 'absolute',
          display: 'block',
          content: '""',
          backgroundColor: 'transparent',
          width: '100%',
          height: 4,
          bottom: 0,
          borderRadius: 10,
        },

        '&:hover:after': {
          backgroundColor: neutralTransparentLight['50'],
        },

        '&.Mui-selected': {
          backgroundColor: primaryLight.lightest,
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        borderBottomColor: neutralTransparentLight['80'],
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        marginBottom: 32,
      },
      indicator: {
        height: 4,
        borderRadius: 10,
      },
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
};

const defaultMoniteComponentsDark = deepmerge(defaultMoniteComponents, {
  MuiTab: {
    styleOverrides: {
      root: {
        color: neutralTransparentDark['50'],
        '&:active': { backgroundColor: neutralTransparentDark['90'] },
        '&:hover:after': { backgroundColor: neutralTransparentDark['50'] },
        '&.Mui-selected': { backgroundColor: primaryDark.lightest },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: { borderBottomColor: neutralTransparentDark['80'] },
    },
  },
});

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
  components: defaultMoniteComponentsDark,
};
