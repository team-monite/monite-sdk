import { createContext, ReactNode, useContext } from 'react';

import { EmotionCacheProvider } from '@/core/context/EmotionCacheProvider';
import {
  MoniteAPIProvider,
  MoniteQraftContext,
} from '@/core/context/MoniteAPIProvider';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteI18nProvider } from '@/core/context/MoniteI18nProvider';
import { MoniteQueryClientProvider } from '@/core/context/MoniteQueryClientProvider';
import { SentryProvider } from '@/core/context/SentryProvider';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';

/**
 * Provides a single instance of `<ScopedCssBaseline/>` component,
 * `<EmotionCacheProvider/>` and `<MuiThemeProvider/>` components.
 * This component prevents the creation of multiple `div` wrappers with the same styles,
 * and multiple Emotion Caches
 */
export const MoniteScopedProviders = ({
  children,
}: {
  children: ReactNode;
}) => {
  const hasStylesContext = useContext(SingleInstanceScopedStyleProviderContext);
  const { theme, apiUrl, fetchToken, queryClient, requestFn } =
    useMoniteContext();

  return hasStylesContext ? (
    <>{children}</>
  ) : (
    <SingleInstanceScopedStyleProviderContext.Provider value={true}>
      <EmotionCacheProvider cacheKey="monite-css">
        <MoniteI18nProvider>
          <MuiThemeProvider theme={theme}>
            <SentryProvider>
              <MoniteQueryClientProvider>
                <MoniteAPIProvider
                  apiUrl={apiUrl}
                  fetchToken={fetchToken}
                  requestFn={requestFn}
                  queryClient={queryClient}
                  APIContext={MoniteQraftContext}
                >
                  {children}
                </MoniteAPIProvider>
              </MoniteQueryClientProvider>
            </SentryProvider>
          </MuiThemeProvider>
        </MoniteI18nProvider>
      </EmotionCacheProvider>
    </SingleInstanceScopedStyleProviderContext.Provider>
  );
};

/**
 * Provides status if the `<MoniteScopedProviders/>` component is already set
 */
const SingleInstanceScopedStyleProviderContext = createContext<boolean>(false);
