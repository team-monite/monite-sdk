import React, { ComponentProps, Suspense, useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ConfigLoader } from '@/lib/ConfigLoader';
import { EntityIdLoader } from '@/lib/EntityIdLoader';
import { moniteSuperComponents } from '@/lib/moniteSuperComponents';
import { useMoniteIframeAppSlots } from '@/lib/useIframeAppSlots';
import { css, Global } from '@emotion/react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SDKDemoAPIProvider } from '@team-monite/sdk-demo';

import { DropInMoniteProvider } from '../lib/DropInMoniteProvider';

// todo::implement google fonts support
// // import { getFontFaceStyles } from './fontStyles.ts';

export const MoniteIframeApp = () => {
  const queryClient = useMemo(() => new QueryClient(), []);

  const { fetchToken, theme, locale } = useMoniteIframeAppSlots();

  return (
    <QueryClientProvider client={queryClient}>
      {/* ToDo: add a spinner or loader fallback */}
      <Suspense fallback={null}>
        <ConfigLoader>
          {({ apiUrl, appBasename }) => (
            <EntityIdLoader fetchToken={fetchToken} apiUrl={apiUrl}>
              {(entityId) => (
                <SDKDemoAPIProvider
                  apiUrl={apiUrl}
                  entityId={entityId}
                  fetchToken={fetchToken}
                >
                  <MoniteIframeAppComponent
                    theme={theme}
                    locale={locale}
                    entityId={entityId}
                    apiUrl={apiUrl}
                    fetchToken={fetchToken}
                    basename={appBasename}
                  />
                </SDKDemoAPIProvider>
              )}
            </EntityIdLoader>
          )}
        </ConfigLoader>
      </Suspense>
    </QueryClientProvider>
  );
};

const MoniteIframeAppComponent = ({
  theme,
  locale,
  basename,
  apiUrl,
  entityId,
  fetchToken,
}: {
  apiUrl: string;
  entityId: string;
  basename: string;
  fetchToken: () => Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>;
} & Pick<ComponentProps<typeof DropInMoniteProvider>, 'locale' | 'theme'>) => {
  return (
    <DropInMoniteProvider
      locale={locale}
      theme={theme}
      sdkConfig={{
        entityId,
        apiUrl,
        fetchToken,
      }}
    >
      <ThemeProvider theme={createTheme(theme)}>
        <CssBaseline enableColorScheme />
        <Global
          styles={css`
            :root,
            :host {
              line-height: 1.5;
              -webkit-font-smoothing: antialiased;
              isolation: isolate;
            }
            *,
            *::before,
            *::after {
              box-sizing: border-box;
            }
          `}
        />
        <BrowserRouter basename={basename || undefined}>
          <Routes>
            {Object.entries(moniteSuperComponents).map(([path, Component]) => (
              <Route
                key={path}
                path={`/${path}`}
                element={
                  <Suspense fallback={null /** add a fallback **/}>
                    <Component />
                  </Suspense>
                }
              />
            ))}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </DropInMoniteProvider>
  );
};
