import { createTheme } from '@mui/material';
import type { Components } from '@mui/material/styles/components';
import type { Theme } from '@mui/material/styles/createTheme';

const components: Components<Omit<Theme, 'components'>> = {
  MuiList: {
    styleOverrides: {
      root: {
        '&.NavigationList': {
          '.MuiCollapse-root .MuiListItemButton-root': {
            paddingLeft: 28,
          },
        },
      },
    },
  },
};

export const materialLight = createTheme({
  components,
  palette: { mode: 'light' },
});

export const materialDark = createTheme({
  components,
  palette: { mode: 'dark' },
});
