'use client';

import React, { PropsWithChildren, useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { useAuth } from '@clerk/nextjs';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Theme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ThemeConfig } from '@team-monite/sdk-demo/src/types';

import * as themes from '@/themes';

type AppThemeProviderContextValue = {
  onThemeChange: (themeConfig: ThemeConfig) => void;
  selectedTheme: ThemeConfig;
  theme: Theme;
};

type RootThemeProviderProps = PropsWithChildren<{
  initialTheme?: ThemeConfig;
}>;

export const RootThemeProviderContext = React.createContext<
  AppThemeProviderContextValue | undefined
>(undefined);

export function AppThemeProvider(props: RootThemeProviderProps) {
  const SELECTED_THEME_QUERY_KEY = ['theme'];
  const USER_THEME_API_ENDPOINT = '/api/user/theme';

  const { children, initialTheme = { variant: 'monite', mode: 'light' } } =
    props;

  const { userId } = useAuth();
  const { i18n } = useLingui();

  const queryClient = useQueryClient();

  const selectedTheme = useQuery<ThemeConfig>({
    enabled: !!userId,
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
        t(i18n)`We were unable to save your theme selection, please try again.`,
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

  return (
    <RootThemeProviderContext.Provider
      value={{
        onThemeChange,
        selectedTheme: selectedTheme.data,
        theme: themes.moniteLight(),
      }}
    >
      <ThemeProvider theme={themes.moniteLight()}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </RootThemeProviderContext.Provider>
  );
}

export const useAppTheme = () => {
  return React.useContext(
    RootThemeProviderContext
  ) as AppThemeProviderContextValue;
};
