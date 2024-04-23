import { createContext, useContext } from 'react';

import { createTheme } from '@mui/material/styles';
import { Theme, ThemeOptions } from '@mui/material/styles/createTheme';

export const MoniteThemeContext = createContext<ThemeOptions | undefined>(
  undefined
);

export function useMoniteThemeContext(): Theme {
  const moniteThemeContext = useContext(MoniteThemeContext);

  return createTheme(moniteThemeContext);
}
