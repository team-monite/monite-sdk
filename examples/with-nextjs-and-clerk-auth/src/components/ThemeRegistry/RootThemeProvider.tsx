'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';

import { Theme } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import * as themes from '@team-monite/sdk-themes';

import NextAppDirEmotionCacheProvider from './EmotionCache';

type Variant = 'monite' | 'material';
type Mode = 'light' | 'dark';
type SelectedTheme = [theme: Variant, mode: Mode];

type Context = {
  setThemeMode: (mode: Mode) => void;
  setThemeVariant: (theme: Variant) => void;
  selectedTheme: SelectedTheme;
  theme: Theme;
};

export const RootThemeProviderContext = React.createContext<
  Context | undefined
>(undefined);

export function RootThemeProvider({ children }: { children: React.ReactNode }) {
  const [selectedTheme, setSelectedTheme] = useState<SelectedTheme>([
    'monite',
    'light',
  ]);

  const setThemeMode = (nextMode: Mode) => {
    setSelectedTheme(([variant]) => [variant, nextMode]);
  };

  const setThemeVariant = (nextTheme: Variant) => {
    setSelectedTheme(([, mode]) => [nextTheme, mode]);
  };

  const theme = useMemo(() => {
    const [currentTheme, currentMode] = selectedTheme;

    switch (true) {
      case currentTheme === 'monite' && currentMode === 'dark':
        return createTheme(themes.moniteDark);

      case currentTheme === 'material' && currentMode === 'light':
        return createTheme(themes.materialLight);

      case currentTheme === 'material' && currentMode === 'dark':
        return createTheme(themes.materialDark);

      default:
        return createTheme(themes.moniteLight);
    }
  }, [selectedTheme]);

  return (
    <RootThemeProviderContext.Provider
      value={{ setThemeMode, setThemeVariant, selectedTheme, theme }}
    >
      <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </RootThemeProviderContext.Provider>
  );
}

export const useRootTheme = () => {
  return React.useContext(RootThemeProviderContext) as Context;
};
