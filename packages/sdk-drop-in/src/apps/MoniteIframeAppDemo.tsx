import {
  DefaultLayout,
  EntityIdLoader,
  SDKDemoAPIProvider,
  SDKDemoI18nProvider,
} from '../utils/sdk-demo-components';
import { AppCircularProgress } from '@/lib/AppCircularProgress';
import { ConfigLoader } from '@/lib/ConfigLoader';
import { MoniteIframeAppCommunicator } from '@/lib/MoniteIframeAppCommunicator';
import { fetchTokenDev } from '@/lib/fetchTokenDev';
import { type APISchema } from '@monite/sdk-react';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';

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
  const localeCode = 'en-US';

  return (
    <>
      <CssBaseline enableColorScheme />
      <SDKDemoI18nProvider localeCode={localeCode}>
        <BrowserRouter basename={location.pathname.split('/')[1]}>
          <DefaultLayout>
            <Routes>
              <Route
                path="/"
                element={
                  <MoniteIframe
                    appBasename={appBasename}
                    appHostname={appHostname}
                    fetchToken={fetchToken}
                    localeCode={localeCode}
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
                  />
                }
              />
            </Routes>
          </DefaultLayout>
        </BrowserRouter>
      </SDKDemoI18nProvider>
    </>
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

    return () => {
      iframeCommunicator.unmountSlot('fetch-token');
      iframeCommunicator.unmountSlot('locale');
    };
  }, [iframeCommunicator, fetchToken, iframeElement, localeCode]);

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
      style={{
        border: 'none',
        width: '100%',
        height: '100%',
        margin: '0',
      }}
    ></iframe>
  );
};

type FetchTokenHandler = () => Promise<
  APISchema.components['schemas']['AccessTokenResponse']
>;
