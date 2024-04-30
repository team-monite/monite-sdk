import { createContext, useContext } from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { createTheme, Theme, ThemeOptions } from '@mui/material';

export const MoniteThemeContext = createContext<Theme | undefined>(undefined);

export function useMoniteThemeContext(): Theme {
  const moniteThemeContext = useContext(MoniteThemeContext);
  if (!moniteThemeContext) {
    throw new Error(
      'useMoniteThemeContext must be used within a MoniteThemeProvider'
    );
  }

  return moniteThemeContext;
}

/**
 * Create a theme with default component's `defaultProps`
 */
export const createThemeWithDefaults = (
  theme: Theme | ThemeOptions | undefined
) =>
  createTheme(theme, {
    components: {
      MuiMenu: {
        defaultProps: {
          classes: {
            root: ScopedCssBaselineContainerClassName,
          },
        },
      },
      MuiModal: {
        defaultProps: {
          classes: {
            root: ScopedCssBaselineContainerClassName,
          },
        },
      },
      MuiPopper: {
        defaultProps: {
          componentsProps: {
            root: { className: ScopedCssBaselineContainerClassName },
          },
        },
      },
      MuiAutocomplete: {
        defaultProps: {
          classes: { popper: ScopedCssBaselineContainerClassName },
        },
      },
    },
  });
