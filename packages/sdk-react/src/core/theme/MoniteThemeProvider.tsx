import { ReactNode, useLayoutEffect, useMemo } from 'react';

import { getTailwindTheme } from '@/core/theme/tailwind/tailwindTheme';
import { useMoniteContext } from '@/index';
import { Global } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

/**
 * Provides the Material Theme and Tailwind Theme to the children components
 */
export const MoniteThemeProvider = ({
  children,
  onThemeMounted,
}: {
  children: ReactNode;
  onThemeMounted?: () => void;
}) => {
  const { theme } = useMoniteContext();

  const tailwindStyles = useMemo(() => getTailwindTheme(theme), [theme]);

  useLayoutEffect(() => {
    onThemeMounted?.();
  }, [onThemeMounted]);

  return (
    <>
      <Global styles={tailwindStyles} />
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </>
  );
};
