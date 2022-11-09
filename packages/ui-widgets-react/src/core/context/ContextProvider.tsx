import React, { ReactNode, useEffect } from 'react';
import { MoniteApp } from '@team-monite/sdk-api';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  THEMES,
  ThemeProvider as UIThemeProvider,
  tokenizedTheme,
  getStyles,
} from '@team-monite/ui-kit-react';
import { Global } from '@emotion/react';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import { I18nextProvider } from 'react-i18next';
import { merge } from 'lodash';
// import { ReactQueryDevtools } from 'react-query/devtools';

import GlobalToast from '../GlobalToast';

import i18n from '../i18n';
import { ComponentsContext } from './ComponentsContext';

interface MoniteProviderProps {
  monite: MoniteApp;
  children?: ReactNode;
  theme?: any; // TODO should be partial Theme
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: false,
      staleTime: Infinity,
    },
  },
});

const MoniteProvider = ({ monite, theme, children }: MoniteProviderProps) => {
  const finalTheme = theme
    ? merge(THEMES.default, tokenizedTheme, theme || {})
    : // REPLACE {} WITH CUSTOM THEME OBJECT OR SET INDIVIDUAL COLORS
      merge(THEMES.default, tokenizedTheme, {});

  useEffect(() => {
    i18n.changeLanguage(monite.locale);
  }, [monite.locale, i18n.changeLanguage]);

  return (
    <ComponentsContext.Provider value={{ monite }}>
      <Global styles={getStyles(finalTheme)} />
      <QueryClientProvider contextSharing={true} client={queryClient}>
        <EmotionThemeProvider theme={finalTheme}>
          <GlobalToast />
          <UIThemeProvider theme={finalTheme}>
            <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
          </UIThemeProvider>
        </EmotionThemeProvider>
        {/*<ReactQueryDevtools />*/}
      </QueryClientProvider>
    </ComponentsContext.Provider>
  );
};

export default MoniteProvider;
