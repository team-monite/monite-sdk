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
  '30': '#2E2EE5',
  '50': '#3737FF',
  '60': '#9999FF',
  '90': '#EBEBFF',
  '95': '#F4F4FE',
};

const primaryDark = {
  '30': '#4545E8',
  '50': '#3737FF',
  '60': '#12129E',
  '90': '#0F0F50',
  '95': '#0C0C40',
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
  '95': '#00000005',
};

export const neutralTransparentDark = {
  '50': '#9595958F',
  '80': '#FFFFFF21',
  '90': '#FFFFFF0D',
  '95': '#00000005',
};

export const paletteLight: PaletteOptions = {
  primary: {
    dark: primaryLight['30'],
    main: primaryLight['50'],
    light: primaryLight['60'],
  },
  secondary,
};

export const paletteDark: PaletteOptions = {
  primary: {
    dark: primaryDark['30'],
    main: primaryDark['50'],
    light: primaryDark['60'],
  },
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
        padding: '12px 20px',
        boxShadow: 'none',
        borderRadius: 8,
        fontSize: 16,
        fontWeight: 500,
        backgroundColor: primaryLight['50'],

        '&:hover': {
          boxShadow: 'none',
          backgroundColor: primaryLight['60'],
        },

        '&:active': {
          boxShadow: 'none',
          backgroundColor: primaryLight['30'],
        },
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
          backgroundColor: primaryLight['95'],
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
  MuiInputAdornment: {
    styleOverrides: {
      positionEnd: {
        svg: {
          margin: 0,
        },
        button: {
          padding: 0,
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        top: 10,
        left: 48,
        transform: 'none',
      },
      shrink: {
        display: 'none',
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        padding: '10px 16px 10px 8px',
      },
      notchedOutline: {
        top: 0,
        legend: { display: 'none' },
      },
      root: {
        borderRadius: 100,
        flexDirection: 'row-reverse',
        padding: '0 3px',
        '&:hover': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: neutralTransparentLight['90'],
          },
        },
        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: neutralTransparentLight['90'],
            borderWidth: 1,
            boxShadow: '0px 0px 0px 4px rgba(55, 55, 255, 0.20)',
          },
        },
        '&.MoniteFilterField': {
          backgroundColor: neutralTransparentLight['95'],

          '&:hover': {
            backgroundColor: neutralTransparentLight['90'],
            fieldset: { borderColor: 'transparent' },
          },

          '&:active': {
            backgroundColor: primaryLight['90'],
            fieldset: { borderColor: 'transparent' },
          },

          '&:focused': {
            backgroundColor: primaryLight['95'],
            fieldset: { borderColor: 'transparent' },
          },

          fieldset: { borderColor: 'transparent' },
        },
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
        '&.Mui-selected': { backgroundColor: primaryDark['95'] },
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
