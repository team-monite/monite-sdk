import { useMoniteContext } from '@/core/context/MoniteContext';
import { getTailwindTheme } from '@/core/theme/tailwind/tailwindTheme';
import { Global } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ReactNode, useLayoutEffect, useMemo } from 'react';

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
