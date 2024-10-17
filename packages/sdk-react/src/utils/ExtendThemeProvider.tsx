import { ReactNode } from 'react';

import { MoniteContext, useMoniteContext } from '@/core/context/MoniteContext';
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material';

/**
 * Extends the current theme with the provided theme options.
 * @param theme The theme options to extend the current theme with.
 * @param children
 */
export function ExtendThemeProvider({
  theme,
  children,
}: {
  theme: ThemeOptions;
  children: ReactNode;
}) {
  const moniteContext = useMoniteContext();
  const extendedTheme = createTheme(moniteContext.theme, theme);
  return (
    <ThemeProvider theme={extendedTheme}>
      <MoniteContext.Provider
        value={{
          ...moniteContext,
          theme: extendedTheme,
        }}
      >
        {children}
      </MoniteContext.Provider>
    </ThemeProvider>
  );
}
