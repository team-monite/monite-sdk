import React, { ComponentProps, Suspense, useEffect, useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { useMoniteIframeAppSlots } from '@/hooks/useIframeAppSlots.tsx';
import { ConfigLoader } from '@/lib/ConfigLoader.tsx';
import { EntityIdLoader } from '@/lib/EntityIdLoader.tsx';
import { moniteSuperComponents } from '@/lib/moniteSuperComponents.tsx';
import { css, Global } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DropInMoniteProvider } from './DropInMoniteProvider';

interface MoniteIframeAppProps
  extends Pick<
    ComponentProps<typeof DropInMoniteProvider>,
    'locale' | 'theme'
  > {
  fetchToken: () => Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>;
}

export const MoniteIframeApp = (props: MoniteIframeAppProps) => {
  const queryClient = useMemo(() => new QueryClient(), []);
  const { fetchToken } = useMoniteIframeAppSlots();

  useEffect(() => {
    const handleFetchTokenRequest = async (event: MessageEvent) => {
      if (event.data.type === 'fetch-token') {
        try {
          const token = await fetchToken();
          window.parent.postMessage({ type: 'token-response', token }, '*');
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      }
    };

    window.addEventListener('message', handleFetchTokenRequest);

    return () => {
      window.removeEventListener('message', handleFetchTokenRequest);
    };
  }, [fetchToken]);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null /** add a fallback **/}>
        <ConfigLoader>
          {({ apiUrl, appBasename }) => (
            // Should be replaced with shared `fetchToken` with built-in invalidation
            // Current implementation fetches two tokens (first for entityId, second for the app)
            <EntityIdLoader fetchToken={props.fetchToken} apiUrl={apiUrl}>
              {(entityId) => (
                <MoniteIframeAppComponent
                  {...props}
                  entityId={entityId}
                  apiUrl={apiUrl}
                  basename={appBasename}
                />
              )}
            </EntityIdLoader>
          )}
        </ConfigLoader>
      </Suspense>
    </QueryClientProvider>
  );
};

export const MoniteIframeAppComponent = ({
  theme,
  locale,
  fetchToken,
  basename,
  apiUrl,
  entityId,
}: MoniteIframeAppProps & {
  apiUrl: string;
  entityId: string;
  basename: string;
}) => {
  return (
    <DropInMoniteProvider
      locale={locale}
      theme={theme}
      sdkConfig={{
        entityId,
        fetchToken,
        apiUrl,
      }}
    >
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
      <BrowserRouter basename={basename}>
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
    </DropInMoniteProvider>
  );
};
