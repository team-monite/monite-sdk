'use client';

import React, { PropsWithChildren } from 'react';

import { createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { themeMonite } from '@/themes/monite';

export function AppThemeProvider(props: PropsWithChildren) {
  const { children } = props;

  return (
    <ThemeProvider theme={createTheme(themeMonite)}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
