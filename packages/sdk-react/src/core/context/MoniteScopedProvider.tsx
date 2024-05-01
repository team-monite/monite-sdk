import React, { createContext, ReactNode, useContext } from 'react';

import { EmotionCacheProvider } from '@/core/context/EmotionCacheProvider';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteI18nProvider } from '@/core/context/MoniteI18nProvider';
import { MoniteQueryClientProvider } from '@/core/context/MoniteQueryClientProvider';
import { useMoniteThemeContext } from '@/core/context/MoniteThemeProvider';
import { SentryProvider } from '@/core/context/SentryProvider';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';

/**
 * Provides a single instance of `<ScopedCssBaseline/>` component,
 * `<EmotionCacheProvider/>` and `<MuiThemeProvider/>` components.
 * This component prevents the creation of multiple `div` wrappers with the same styles,
 * and multiple Emotion Caches
 */
export const MoniteScopedProvider = ({ children }: { children: ReactNode }) => {
  const hasStylesContext = useContext(SingleInstanceScopedStyleProviderContext);
  const theme = useMoniteThemeContext();

  return hasStylesContext ? (
    <>{children}</>
  ) : (
    <SingleInstanceScopedStyleProviderContext.Provider value={true}>
      <EmotionCacheProvider cacheKey="monite-css">
        <MoniteI18nProvider>
          <MuiThemeProvider theme={theme}>
            <ScopedCssBaseline enableColorScheme>
              <SentryProvider>
                <MoniteQueryClientProvider>
                  {children}
                </MoniteQueryClientProvider>
              </SentryProvider>
            </ScopedCssBaseline>
          </MuiThemeProvider>
        </MoniteI18nProvider>
      </EmotionCacheProvider>
    </SingleInstanceScopedStyleProviderContext.Provider>
  );
};

/**
 * Provides status if the `<MoniteScopedProvider/>` component is already set
 */
const SingleInstanceScopedStyleProviderContext = createContext<boolean>(false);
