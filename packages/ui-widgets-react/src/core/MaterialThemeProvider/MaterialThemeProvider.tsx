import React, { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material';
import materialTheme from './material';

export type OnboardingHeaderProps = {
  children: ReactNode;
};

export default function MaterialThemeProvider({
  children,
}: OnboardingHeaderProps) {
  return <ThemeProvider theme={materialTheme}>{children}</ThemeProvider>;
}
