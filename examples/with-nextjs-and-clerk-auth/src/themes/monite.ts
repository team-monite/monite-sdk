import { createTheme } from '@mui/material';
import type { Components } from '@mui/material/styles/components';
import type {
  Palette,
  PaletteOptions,
} from '@mui/material/styles/createPalette';
import type { Theme } from '@mui/material/styles/createTheme';
import type { TypographyOptions } from '@mui/material/styles/createTypography';
import { deepmerge } from '@mui/utils';
import {
  moniteLight as baseMoniteLight,
  moniteDark as baseMoniteDark,
} from '@team-monite/sdk-themes';

const paletteLight: PaletteOptions = {
  primary: {
    dark: '#1D59CC',
    main: '#3737FF',
    light: '#F4F8FF',
  },
  background: {
    menu: '#F1F2F5',
    highlight: '#EBEBFF',
  },
  neutral: {
    '10': '#111111',
    '50': '#707070',
    '80': '#DDDDDD',
  },
};

const paletteDark: PaletteOptions = {
  primary: {
    dark: '#1D59CC',
    main: '#3737FF',
    light: '#F4F8FF',
  },
  background: {
    menu: '#F1F2F505',
  },
  neutral: {
    '80': '#B8B8B8',
    '50': '#F3F3F3',
    '10': '#FFFFFF',
  },
};

const typography:
  | TypographyOptions
  | ((palette: Palette) => TypographyOptions) = {
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
    fontWeight: 500,
  },
  label2: {
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: 500,
  },
  label3: {
    fontSize: '0.75rem',
    fontStyle: 'normal',
    fontWeight: 600,
  },
};

const typographyLight = deepmerge(typography, {
  body2: {
    color: paletteLight.neutral && paletteLight.neutral['10'],
  },
  label3: {
    color: paletteLight.neutral && paletteLight.neutral['50'],
  },
});

const typographyDark = deepmerge(typography, {
  body2: {
    color: paletteDark.neutral && paletteDark.neutral['10'],
  },
  label3: {
    color: paletteDark.neutral && paletteDark.neutral['80'],
  },
});

const components: Components<Omit<Theme, 'components'>> = {
  MuiDrawer: {
    styleOverrides: {
      root: {
        '&.LayoutNavigationDrawer .MuiPaper-root': {
          borderRight: 0,
        },
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: {
        '&.NavigationList': {
          margin: '0px 12px',

          '.MuiListItem-root': {
            marginTop: 8,
          },

          '.MuiListItemButton-root': {
            borderRadius: 6,
            padding: '8px 12px',
          },

          '.MuiListItemIcon-root': {
            minWidth: 35,
          },

          '.MuiCollapse-root': {
            marginTop: -8,
            marginLeft: 12,
          },

          '.Mui-selected': {
            color: 'primary.main',
          },
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
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
  MuiPopover: {
    styleOverrides: {
      paper: {
        border: 'none',
        borderRadius: 16,
        width: 240,
      },
    },
  },
};

export const moniteLight = () =>
  createTheme(
    deepmerge(baseMoniteLight, {
      palette: paletteLight,
      typography: typographyLight,
      components,
    })
  );

export const moniteDark = () =>
  createTheme(
    deepmerge(baseMoniteDark, {
      palette: paletteDark,
      typography: typographyDark,
      components,
    })
  );
