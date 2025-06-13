import { ComponentProps, Suspense, useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppCircularProgress } from '@/lib/AppCircularProgress.tsx';
import { ConfigLoader } from '@/lib/ConfigLoader';
import { moniteIframeAppComponents } from '@/lib/moniteIframeAppComponents';
import { useMoniteIframeAppSlots } from '@/lib/useIframeAppSlots';
import { css, Global } from '@emotion/react';
import { type APISchema } from '@monite/sdk-react';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EntityIdLoader, SDKDemoAPIProvider } from '@team-monite/sdk-demo';

import { DropInMoniteProvider } from '../lib/DropInMoniteProvider';

export const MoniteIframeApp = () => {
  const queryClient = useMemo(() => new QueryClient(), []);

  const { fetchToken, theme, locale, componentSettings } =
    useMoniteIframeAppSlots();

  const isTestEnvironment = useMemo(() => {
    if (typeof window === 'undefined') return false;

    return (
      window.location.search.includes('test=playwright') ||
      window.location.search.includes('test=e2e') ||
      navigator.userAgent.includes('Playwright') ||
      navigator.userAgent.includes('HeadlessChrome') ||
      (window.parent !== window &&
        window.parent.location.search.includes('test=playwright'))
    );
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<AppCircularProgress />}>
        <ConfigLoader>
          {({ apiUrl, appBasename }) => {
            if (isTestEnvironment) {
              const mockFetchToken = () =>
                Promise.resolve({
                  access_token: 'mocked_access_token_for_e2e_tests',
                  token_type: 'Bearer' as const,
                  expires_in: 3600,
                });

              return (
                <MoniteIframeAppComponent
                  theme={theme}
                  componentSettings={componentSettings}
                  locale={locale}
                  entityId="mocked_entity_id_for_e2e"
                  apiUrl={apiUrl}
                  fetchToken={mockFetchToken}
                  basename={appBasename}
                />
              );
            }

            return (
              <EntityIdLoader fetchToken={fetchToken} apiUrl={apiUrl}>
                {(entityId: string) => (
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
            );
          }}
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
        <BrowserRouter
          basename={basename || undefined}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
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
