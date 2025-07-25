'use client';

import { themeMonite } from '@/themes/monite';
import { createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React, { PropsWithChildren } from 'react';

export function AppThemeProvider(props: PropsWithChildren) {
  const { children } = props;

  return (
    <ThemeProvider theme={createTheme(themeMonite)}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
