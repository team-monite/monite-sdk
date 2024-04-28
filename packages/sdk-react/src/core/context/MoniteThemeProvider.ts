import { createContext, useContext } from 'react';

import { Theme } from '@mui/material';

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
