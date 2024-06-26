import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { ConfigLoader, getConfig } from '@/lib/ConfigLoader';
import { EntityIdLoader } from '@/lib/EntityIdLoader';
import { MoniteIframeAppCommunicator } from '@/lib/MoniteIframeAppCommunicator.ts';
import { createAPIClient } from '@monite/sdk-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  DefaultLayout,
  getThemeConfig,
  SDKDemoAPIProvider,
  SDKDemoI18nProvider,
  useThemeConfig,
} from '@team-monite/sdk-demo';

export const MoniteIframeAppConsumer = () => {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <ConfigLoader>
          {({ apiUrl, appBasename, appHostname }) => (
            <EntityIdLoader
              apiUrl={apiUrl}
              fetchToken={() => fetchIframeConsumerToken({ apiUrl })}
            >
              {(entityId) => (
                <SDKDemoAPIProvider
                  apiUrl={apiUrl}
                  entityId={entityId}
                  fetchToken={() => fetchIframeConsumerToken({ apiUrl })}
                >
                  <MoniteIframeAppConsumerComponent
                    appBasename={appBasename}
                    appHostname={appHostname}
                    fetchToken={() => fetchIframeConsumerToken({ apiUrl })}
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

const MoniteIframeAppConsumerComponent = ({
  appBasename,
  appHostname,
  fetchToken,
}: {
  appBasename: string;
  appHostname: string;
  fetchToken: FetchTokenHandler;
}) => {
  const { themeConfig, setThemeConfig } = useThemeConfig();
  const sdkDemoTheme = createTheme(getThemeConfig(themeConfig), {
    components: {
      MoniteInvoiceStatusChip: {
        defaultProps: {
          icon: true,
        },
      },
      MonitePayableStatusChip: {
        defaultProps: {
          icon: true,
        },
      },
      MoniteTablePagination: {
        defaultProps: {
          pageSizeOptions: [10, 15, 20],
        },
      },
    },
  });

  const localeCode = 'en-US';
  return (
    <ThemeProvider theme={sdkDemoTheme}>
      <CssBaseline enableColorScheme />
      <SDKDemoI18nProvider localeCode={localeCode}>
        <BrowserRouter basename={location.pathname.split('/')[1]}>
          <DefaultLayout
            themeConfig={themeConfig}
            setThemeConfig={setThemeConfig}
          >
            <Routes>
              <Route
                path="*"
                element={
                  <MoniteIframe
                    appBasename={appBasename}
                    appHostname={appHostname}
                    fetchToken={fetchToken}
                    localeCode={localeCode}
                  />
                }
              />
            </Routes>
          </DefaultLayout>
        </BrowserRouter>
      </SDKDemoI18nProvider>
    </ThemeProvider>
  );
};

const MoniteIframe = ({
  appHostname,
  appBasename,
  localeCode,
  fetchToken,
}: {
  appHostname: string;
  appBasename: string;
  localeCode: string;
  fetchToken: FetchTokenHandler;
}) => {
  const portSegment = location.port ? `:${location.port}` : '';
  const { pathname } = useLocation();
  const iframeUrl = `//${appHostname}${portSegment}/${appBasename}${pathname}`;

  const [iframeElement, setIframeElement] = useState<HTMLIFrameElement | null>(
    null
  );

  useEffect(() => {
    if (!iframeElement) return;
    const channelPortManager = new MoniteIframeAppCommunicator(iframeElement);
    channelPortManager.mountSlot('fetch-token', fetchToken);
    channelPortManager.mountSlot('locale', { code: localeCode });
    channelPortManager.connect();

    return () => {
      channelPortManager.disconnect();
    };
  }, [fetchToken, iframeElement, localeCode]);
  return (
    <iframe
      key={pathname.split('/')[1]}
      ref={setIframeElement}
      className="monite-iframe-app"
      src={iframeUrl}
    ></iframe>
  );
};

async function fetchIframeConsumerToken({ apiUrl }: { apiUrl: string }) {
  const { entity_user_id, client_id, client_secret } = await getConfig();
  const { api, requestFn } = createAPIClient();
  return await api.auth.postAuthToken(
    {
      baseUrl: apiUrl,
      parameters: {},
      body: {
        grant_type: 'entity_user',
        entity_user_id,
        client_id,
        client_secret,
      },
    },
    requestFn
  );
}

type FetchTokenHandler = () => Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
}>;
