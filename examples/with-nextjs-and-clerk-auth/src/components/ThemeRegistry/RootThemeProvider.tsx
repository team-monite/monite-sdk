'use client';

import * as React from 'react';
import { PropsWithChildren, useCallback, useMemo } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Theme } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ThemeConfig } from '@team-monite/sdk-demo/src/types';
import * as themes from '@team-monite/sdk-themes';

import { PrivateMetadata, SelectedTheme } from '@/lib/clerk-api/types';

import NextAppDirEmotionCacheProvider from './EmotionCache';

type Context = {
  onThemeChange: (themeConfig: ThemeConfig) => void;
  selectedTheme: ThemeConfig;
  theme: Theme;
};

type RootThemeProviderProps = PropsWithChildren<{
  initialTheme?: SelectedTheme;
}>;

const QUERY_KEY = ['theme'];
const METADATA_ROUTE = '/api/user/theme';

export const RootThemeProviderContext = React.createContext<
  Context | undefined
>(undefined);

export function RootThemeProvider(props: RootThemeProviderProps) {
  const { children, initialTheme = ['monite', 'light'] } = props;
  const { userId } = useAuth();

  const queryClient = useQueryClient();

  const selectedTheme = useQuery<SelectedTheme>({
    enabled: userId !== null,
    queryKey: QUERY_KEY,
    initialData: () => initialTheme,
    queryFn: async () => {
      const response = await fetch(METADATA_ROUTE);
      const { selectedTheme } = (await response.json()) as PrivateMetadata;

      return selectedTheme;
    },
  });

  const mutateSelectedTheme = useMutation<SelectedTheme, Error, SelectedTheme>({
    mutationFn: async (nextSelectedTheme) => {
      const response = await fetch(METADATA_ROUTE, {
        method: 'PUT',
        body: JSON.stringify({ selectedTheme: nextSelectedTheme }),
        headers: { contentType: 'application/json' },
      });

      const { selectedTheme } = (await response.json()) as PrivateMetadata;

      return selectedTheme;
    },
    onSuccess: (selectedTheme) => {
      queryClient.setQueryData(QUERY_KEY, selectedTheme);
    },
  });

  const onThemeChange = useCallback((themeConfig: ThemeConfig) => {
    //
  }, []);

  const theme = useMemo(() => {
    const [currentTheme, currentMode] = selectedTheme.data;

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
  }, [selectedTheme.data]);

  return (
    <RootThemeProviderContext.Provider
      value={{
        onThemeChange,
        selectedTheme: { variant: 'monite', mode: 'dark' },
        theme,
      }}
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
