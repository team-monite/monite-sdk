import { createTheme } from '@mui/material';
import type { Components } from '@mui/material/styles/components';
import type { Palette } from '@mui/material/styles/createPalette';
import type { Theme } from '@mui/material/styles/createTheme';
import type { TypographyOptions } from '@mui/material/styles/createTypography';
import { deepmerge } from '@mui/utils';
import {
  moniteLight as baseMoniteLight,
  moniteDark as baseMoniteDark,
  neutralLight,
  neutralDark,
} from '@team-monite/sdk-themes';

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
    color: neutralLight['10'],
  },
  label3: {
    color: neutralLight['50'],
  },
});

const typographyDark = deepmerge(typography, {
  body2: {
    color: neutralDark['10'],
  },
  label3: {
    color: neutralDark['80'],
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
      typography: typographyLight,
      components,
    })
  );

export const moniteDark = () =>
  createTheme(
    deepmerge(baseMoniteDark, {
      typography: typographyDark,
      components,
    })
  );
