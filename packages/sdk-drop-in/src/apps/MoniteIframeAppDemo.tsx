import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';

import { AppCircularProgress } from '@/lib/AppCircularProgress.tsx';
import { ConfigLoader } from '@/lib/ConfigLoader';
import { EntityIdLoader } from '@/lib/EntityIdLoader';
import { fetchTokenDev } from '@/lib/fetchTokenDev';
import { MoniteIframeAppCommunicator } from '@/lib/MoniteIframeAppCommunicator';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  DefaultLayout,
  getThemeOptions,
  SDKDemoAPIProvider,
  SDKDemoI18nProvider,
  useThemeConfig,
} from '@team-monite/sdk-demo';

export const MoniteIframeAppDemo = () => {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<AppCircularProgress color="primary" />}>
        <ConfigLoader>
          {({ apiUrl, appBasename, appHostname }) => (
            <EntityIdLoader apiUrl={apiUrl} fetchToken={fetchTokenDev}>
              {(entityId) => (
                <SDKDemoAPIProvider
                  apiUrl={apiUrl}
                  entityId={entityId}
                  fetchToken={fetchTokenDev}
                >
                  <MoniteIframeAppConsumerComponent
                    appBasename={appBasename}
                    appHostname={appHostname}
                    fetchToken={fetchTokenDev}
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

  const localeCode = 'en-US';
  return (
    <ThemeProvider theme={createTheme(getThemeOptions(themeConfig))}>
      <CssBaseline enableColorScheme />
      <SDKDemoI18nProvider localeCode={localeCode}>
        <BrowserRouter basename={location.pathname.split('/')[1]}>
          <DefaultLayout
            themeConfig={themeConfig}
            setThemeConfig={setThemeConfig}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <MoniteIframe
                    appBasename={appBasename}
                    appHostname={appHostname}
                    fetchToken={fetchToken}
                    localeCode={localeCode}
                    themeConfig={themeConfig}
                  />
                }
              />
              <Route
                path="/settings/:component"
                element={
                  <MoniteIframe
                    appBasename={appBasename}
                    appHostname={appHostname}
                    fetchToken={fetchToken}
                    localeCode={localeCode}
                    themeConfig={themeConfig}
                  />
                }
              />
              <Route
                path="/:component"
                element={
                  <MoniteIframe
                    appBasename={appBasename}
                    appHostname={appHostname}
                    fetchToken={fetchToken}
                    localeCode={localeCode}
                    themeConfig={themeConfig}
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
  themeConfig,
}: {
  appHostname: string;
  appBasename: string;
  localeCode: string;
  fetchToken: FetchTokenHandler;
  themeConfig: ReturnType<typeof useThemeConfig>['themeConfig'];
}) => {
  const portSegment = location.port ? `:${location.port}` : '';
  const { component = 'payables' } = useParams<'component'>();

  const iframeUrl = `//${
    appHostname || location.hostname
  }${portSegment}/${appBasename}/${component}`;

  const [iframeElement, setIframeElement] = useState<HTMLIFrameElement | null>(
    null
  );

  const iframeCommunicator = useMemo(() => {
    return iframeElement && new MoniteIframeAppCommunicator(iframeElement);
  }, [iframeElement]);

  useEffect(() => {
    if (!iframeCommunicator) return;
    iframeCommunicator.mountSlot('fetch-token', fetchToken);
    iframeCommunicator.mountSlot('locale', { code: localeCode });
    iframeCommunicator.mountSlot('theme', getThemeOptions(themeConfig));

    return () => {
      iframeCommunicator.unmountSlot('fetch-token');
      iframeCommunicator.unmountSlot('locale');
      iframeCommunicator.unmountSlot('theme');
    };
  }, [iframeCommunicator, fetchToken, iframeElement, localeCode, themeConfig]);

  useEffect(() => {
    if (!iframeCommunicator) return;
    iframeCommunicator.connect();
    return () => void iframeCommunicator.disconnect();
  }, [iframeCommunicator]);

  return (
    <iframe
      key={component}
      ref={setIframeElement}
      src={iframeUrl}
      style={{ border: 'none', width: '100%', height: '100%' }}
    ></iframe>
  );
};

type FetchTokenHandler = () => Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
}>;
