import { ComponentProps, Suspense, useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppCircularProgress } from '@/lib/AppCircularProgress';
import { ConfigLoader } from '@/lib/ConfigLoader';
import { DropInMoniteProvider } from '@/lib/DropInMoniteProvider';
import { moniteIframeAppComponents } from '@/lib/moniteIframeAppComponents';
import { useMoniteIframeAppSlots } from '@/lib/useIframeAppSlots';
import { css, Global } from '@emotion/react';
import { type APISchema } from '@monite/sdk-react';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EntityIdLoader, SDKDemoAPIProvider } from '@team-monite/sdk-demo';

export const MoniteIframeApp = () => {
  const queryClient = useMemo(() => new QueryClient(), []);

  const { fetchToken, theme, locale, componentSettings } =
    useMoniteIframeAppSlots();

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<AppCircularProgress />}>
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
                    componentSettings={componentSettings}
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
  componentSettings,
  locale,
  basename,
  apiUrl,
  entityId,
  fetchToken,
}: {
  apiUrl: string;
  entityId: string;
  basename: string;
  fetchToken: () => Promise<
    APISchema.components['schemas']['AccessTokenResponse']
  >;
} & Pick<
  ComponentProps<typeof DropInMoniteProvider>,
  'locale' | 'theme' | 'componentSettings'
>) => {
  return (
    <DropInMoniteProvider
      locale={locale}
      theme={theme}
      componentSettings={componentSettings}
      sdkConfig={{
        entityId,
        apiUrl,
        fetchToken,
      }}
    >
      <>
        <CssBaseline enableColorScheme />
        <Global
          styles={css`
            body,
            :root,
            :host,
            #root {
              width: 100%;
              height: 100%;
              -webkit-font-smoothing: antialiased;
              isolation: isolate;
            }

            #root {
              padding: 32px 32px 0 32px;
              display: flex;
              flex-direction: column;
              overflow: hidden;
              justify-content: stretch;
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
            <Route
              path={'/'}
              element={
                <Suspense fallback={<AppCircularProgress />}>
                  <moniteIframeAppComponents.payables />
                </Suspense>
              }
            />
            {Object.entries(moniteIframeAppComponents).map(
              ([path, Component]) => (
                <Route
                  key={path}
                  path={`/${path}`}
                  element={
                    <Suspense fallback={<AppCircularProgress />}>
                      <Component />
                    </Suspense>
                  }
                />
              )
            )}
          </Routes>
        </BrowserRouter>
      </>
    </DropInMoniteProvider>
  );
};
