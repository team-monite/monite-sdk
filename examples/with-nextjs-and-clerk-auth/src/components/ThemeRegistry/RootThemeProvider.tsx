'use client';

import React, { PropsWithChildren, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { useAuth } from '@clerk/nextjs';
import { Theme } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ThemeConfig } from '@team-monite/sdk-demo/src/types';
import * as themes from '@team-monite/sdk-themes';

import NextAppDirEmotionCacheProvider from './EmotionCache';

type Context = {
  onThemeChange: (themeConfig: ThemeConfig) => void;
  selectedTheme: ThemeConfig;
  theme: Theme;
};

type RootThemeProviderProps = PropsWithChildren<{
  initialTheme?: ThemeConfig;
}>;

export const RootThemeProviderContext = React.createContext<
  Context | undefined
>(undefined);

export function RootThemeProvider(props: RootThemeProviderProps) {
  const SELECTED_THEME_QUERY_KEY = ['theme'];
  const USER_THEME_API_ENDPOINT = '/api/user/theme';

  const { children, initialTheme = { variant: 'monite', mode: 'light' } } =
    props;

  const { userId } = useAuth();

  const queryClient = useQueryClient();

  const selectedTheme = useQuery<ThemeConfig>({
    enabled: userId !== null,
    queryKey: SELECTED_THEME_QUERY_KEY,
    initialData: () => initialTheme,
    queryFn: async () => {
      const response = await fetch(USER_THEME_API_ENDPOINT);
      return response.json();
    },
  });

  const mutateSelectedTheme = useMutation<
    void,
    Error,
    ThemeConfig,
    ThemeConfig
  >({
    mutationFn: async (selectedTheme) => {
      const response = await fetch(USER_THEME_API_ENDPOINT, {
        method: 'PUT',
        body: JSON.stringify(selectedTheme),
        headers: { contentType: 'application/json' },
      });

      if (!response.ok) {
        throw new Error();
      }
    },
    onMutate: async (selectedTheme) => {
      const prevSelectedTheme = queryClient.getQueryData<ThemeConfig>(
        SELECTED_THEME_QUERY_KEY
      );

      queryClient.setQueryData<ThemeConfig>(
        SELECTED_THEME_QUERY_KEY,
        selectedTheme
      );

      return prevSelectedTheme;
    },
    onError: (_, __, prevSelectedTheme) => {
      if (prevSelectedTheme) {
        queryClient.setQueryData<ThemeConfig>(
          SELECTED_THEME_QUERY_KEY,
          prevSelectedTheme
        );
      }

      toast.error(
        'We were unable to save your theme selection, please try again.',
        { position: 'bottom-right' }
      );
    },
    onSuccess: (selectedTheme) => {
      queryClient.setQueryData(SELECTED_THEME_QUERY_KEY, selectedTheme);
    },
  });

  const onThemeChange = useCallback(
    (themeConfig: ThemeConfig) => {
      mutateSelectedTheme.mutate(themeConfig);
    },
    [mutateSelectedTheme]
  );

  const theme = useMemo(() => {
    const { variant, mode } = selectedTheme.data ?? {};

    switch (true) {
      case variant === 'monite' && mode === 'dark':
        return createTheme(themes.moniteDark);

      case variant === 'material' && mode === 'light':
        return createTheme(themes.materialLight);

      case variant === 'material' && mode === 'dark':
        return createTheme(themes.materialDark);

      default:
        return createTheme(themes.moniteLight);
    }
  }, [selectedTheme.data]);

  return (
    <RootThemeProviderContext.Provider
      value={{ onThemeChange, selectedTheme: selectedTheme.data, theme }}
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
