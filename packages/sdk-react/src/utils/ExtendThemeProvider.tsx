'use client';

import React, { ReactNode } from 'react';

import {
  createTheme,
  ThemeOptions,
  ThemeProvider,
  useTheme,
} from '@mui/material';

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
  const mainTheme = useTheme();
  return (
    <ThemeProvider theme={createTheme(mainTheme, theme)}>
      {children}
    </ThemeProvider>
  );
}
