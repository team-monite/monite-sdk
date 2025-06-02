import { createContext, type ReactNode, useContext } from 'react';

import { EmotionCacheProvider } from '@/core/context/EmotionCacheProvider';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteI18nProvider } from '@/core/context/MoniteI18nProvider';
import { SentryProvider } from '@/core/context/SentryProvider';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';

import { MoniteErrorBoundary } from './MoniteErrorBoundary';

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
  const { theme, componentSettings, environment, entityId } = useMoniteContext(); // Get environment and entityId
  const hasStyles = useContext(SingleInstanceScopedStyleProviderContext);

  if (hasStyles) {
    return <>{children}</>;
  }

  return (
    <SingleInstanceScopedStyleProviderContext.Provider value={true}>
      <EmotionCacheProvider cacheKey="monite-css">
        <MoniteI18nProvider>
          <MuiThemeProvider theme={theme}>
            <MoniteErrorBoundary>
              <SentryProvider
                config={{ enabled: true, tags: { environment, entityId } }} // Use real values
                iconWrapperSettings={componentSettings?.general?.iconWrapper}
              >
                {children}
              </SentryProvider>
            </MoniteErrorBoundary>
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
