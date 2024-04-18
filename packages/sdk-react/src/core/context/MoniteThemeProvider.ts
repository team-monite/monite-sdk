import { createContext, useContext } from 'react';

import { createTheme } from '@mui/material/styles';
import { Theme, ThemeOptions } from '@mui/material/styles/createTheme';

export const MoniteThemeContext = createContext<ThemeOptions | undefined>(
  undefined
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
