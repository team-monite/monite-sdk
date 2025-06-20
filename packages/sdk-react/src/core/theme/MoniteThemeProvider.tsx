import { ReactNode, useMemo } from 'react';

import { getTailwindTheme } from '@/core/theme/tailwind/tailwindTheme';
import { useMoniteContext } from '@/index';
import { Global } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

/**
 * Provides the Material Theme and Tailwind Theme to the children components
 */
export const MoniteThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useMoniteContext();

  const tailwindStyles = useMemo(() => getTailwindTheme(theme), [theme]);

  return (
    <>
      <Global styles={tailwindStyles} />
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </>
  );
};
