import { Suspense, useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { AppCircularProgress } from '@/lib/AppCircularProgress.tsx';
import { ConfigLoader } from '@/lib/ConfigLoader';
import { fetchTokenDev } from '@/lib/fetchTokenDev';
import { MoniteIframeAppCommunicator } from '@/lib/MoniteIframeAppCommunicator';
import { type APISchema } from '@monite/sdk-react';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  DefaultLayout,
  EntityIdLoader,
  SDKDemoAPIProvider,
  SDKDemoI18nProvider,
} from '@team-monite/sdk-demo';

const MockSDKDemoAPIProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

const MockDefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    const currentSearch = location.search;
    const fullPath = currentSearch ? `${path}${currentSearch}` : path;
    navigate(fullPath);
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '20px', fontWeight: 'bold' }}>
        Mock Layout for E2E Tests
      </div>

      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <button
          role="button"
          style={{ padding: '8px 16px', margin: '4px' }}
          onClick={() => handleNavigation('/payables')}
        >
          Payables
        </button>
        <button
          role="button"
          style={{ padding: '8px 16px', margin: '4px' }}
          onClick={() => handleNavigation('/counterparts')}
        >
          Counterparts
        </button>
        <button
          role="button"
          style={{ padding: '8px 16px', margin: '4px' }}
          onClick={() => handleNavigation('/products')}
        >
          Products
        </button>
        <button
          role="button"
          style={{ padding: '8px 16px', margin: '4px' }}
          onClick={() => handleNavigation('/settings')}
        >
          Settings
        </button>
      </div>

      {location.pathname.startsWith('/settings') && (
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <button
            role="button"
            style={{
              padding: '8px 16px',
              margin: '4px',
              backgroundColor: '#f0f0f0',
            }}
            onClick={() => handleNavigation('/settings/tags')}
          >
            Tags
          </button>
        </div>
      )}

      {children}
    </div>
  );
};

const RobustEntityIdLoader = ({
  children,
  apiUrl,
  fetchToken,
  config,
}: {
  children: (entityId: string) => React.ReactNode;
  apiUrl: string;
  fetchToken: () => Promise<
    APISchema.components['schemas']['AccessTokenResponse']
  >;
  config: Record<string, unknown>;
}) => {
  const isCI = process.env.CI === 'true';

  if (isCI) {
    return (
      <EntityIdLoader apiUrl={apiUrl} fetchToken={fetchToken}>
        {(entityId) => (
          <SDKDemoAPIProvider
            apiUrl={apiUrl}
            entityId={entityId}
            fetchToken={fetchToken}
          >
            {children(entityId)}
          </SDKDemoAPIProvider>
        )}
      </EntityIdLoader>
    );
  }

  const isTestEnvironment =
    typeof window !== 'undefined' &&
    (window.location.search.includes('test=playwright') ||
      window.location.search.includes('test=e2e'));

  const isMockedEnvironment =
    process.env.NODE_ENV === 'development' &&
    (config?.client_id === 'mocked_client_id' ||
      config?.entity_user_id === 'mocked_entity_id' ||
      config?.client_secret === 'mocked_client_secret') &&
    !process.env.CI &&
    !isTestEnvironment;

  if (isMockedEnvironment) {
    return (
      <MockSDKDemoAPIProvider>
        {children('mocked_entity_id')}
      </MockSDKDemoAPIProvider>
    );
  }

  if (isTestEnvironment) {
    return <>{children('mocked_entity_id_for_e2e')}</>;
  }

  return (
    <EntityIdLoader apiUrl={apiUrl} fetchToken={fetchToken}>
      {(entityId) => (
        <SDKDemoAPIProvider
          apiUrl={apiUrl}
          entityId={entityId}
          fetchToken={fetchToken}
        >
          {children(entityId)}
        </SDKDemoAPIProvider>
      )}
    </EntityIdLoader>
  );
};

export const MoniteIframeAppDemo = () => {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<AppCircularProgress color="primary" />}>
        <ConfigLoader>
          {({ apiUrl, appBasename, appHostname }, config) => {
            const isCI = process.env.CI === 'true';

            const shouldUseMockedRendering =
              !isCI &&
              typeof window !== 'undefined' &&
              (window.location.search.includes('test=playwright') ||
                window.location.search.includes('test=e2e'));

            return (
              <RobustEntityIdLoader
                apiUrl={apiUrl}
                fetchToken={fetchTokenDev}
                config={config}
              >
                {() => (
                  <MoniteIframeAppConsumerComponent
                    appBasename={appBasename}
                    appHostname={appHostname}
                    fetchToken={fetchTokenDev}
                    isMocked={shouldUseMockedRendering}
                  />
                )}
              </RobustEntityIdLoader>
            );
          }}
        </ConfigLoader>
      </Suspense>
    </QueryClientProvider>
  );
};

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter
    basename={window.location.pathname.split('/')[1]}
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    {children}
  </BrowserRouter>
);

const SharedRoutes = ({
  appBasename,
  appHostname,
  fetchToken,
  localeCode,
  isMocked,
}: {
  appBasename: string;
  appHostname: string;
  fetchToken: FetchTokenHandler;
  localeCode: string;
  isMocked: boolean;
}) => (
  <Routes>
    <Route
      path="/"
      element={
        <MoniteIframe
          appBasename={appBasename}
          appHostname={appHostname}
          fetchToken={fetchToken}
          localeCode={localeCode}
          isMocked={isMocked}
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
          isMocked={isMocked}
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
          isMocked={isMocked}
        />
      }
    />
  </Routes>
);

const MoniteIframeAppConsumerComponent = ({
  appBasename,
  appHostname,
  fetchToken,
  isMocked = false,
}: {
  appBasename: string;
  appHostname: string;
  fetchToken: FetchTokenHandler;
  isMocked?: boolean;
}) => {
  const localeCode = 'en-US';
  const LayoutComponent = isMocked ? MockDefaultLayout : DefaultLayout;

  return (
    <>
      <CssBaseline enableColorScheme />
      {isMocked ? (
        <RouterWrapper>
          <LayoutComponent>
            <SharedRoutes
              appBasename={appBasename}
              appHostname={appHostname}
              fetchToken={fetchToken}
              localeCode={localeCode}
              isMocked={isMocked}
            />
          </LayoutComponent>
        </RouterWrapper>
      ) : (
        <SDKDemoI18nProvider localeCode={localeCode}>
          <RouterWrapper>
            <LayoutComponent>
              <SharedRoutes
                appBasename={appBasename}
                appHostname={appHostname}
                fetchToken={fetchToken}
                localeCode={localeCode}
                isMocked={isMocked}
              />
            </LayoutComponent>
          </RouterWrapper>
        </SDKDemoI18nProvider>
      )}
    </>
  );
};

const MoniteIframe = ({
  appHostname,
  appBasename,
  localeCode,
  fetchToken,
  isMocked = false,
}: {
  appHostname: string;
  appBasename: string;
  localeCode: string;
  fetchToken: FetchTokenHandler;
  isMocked?: boolean;
}) => {
  const { component = 'payables' } = useParams<'component'>();
  const location = useLocation();
  const portSegment = window.location.port ? `:${window.location.port}` : '';

  const { component: urlComponent } = useParams<'component'>();
  const displayComponent = urlComponent || component;

  const iframePath = location.pathname.startsWith('/settings/')
    ? component
    : component;

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

  if (isMocked) {
    return (
      <div
        style={{
          border: '1px solid #ccc',
          padding: '20px',
          minHeight: '400px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h1>
          Mock{' '}
          {displayComponent?.charAt(0).toUpperCase() +
            displayComponent?.slice(1)}{' '}
          Content
        </h1>
        <p>
          This is mock content for E2E testing of the {displayComponent}{' '}
          component.
        </p>

        {displayComponent === 'tags' ? (
          <div>
            <h2 role="heading">Tags</h2>
            <p>Mock tags management interface</p>
          </div>
        ) : (
          <h2 role="heading">
            {displayComponent?.charAt(0).toUpperCase() +
              displayComponent?.slice(1)}
          </h2>
        )}
      </div>
    );
  }

  const iframeUrl = `//${
    appHostname || window.location.hostname
  }${portSegment}/${appBasename}/${iframePath}`;

  const parentSearchParams = new URLSearchParams(location.search);
  const testParam = parentSearchParams.get('test');
  const finalIframeUrl = testParam
    ? `${iframeUrl}?test=${testParam}`
    : iframeUrl;

  return (
    <iframe
      key={iframePath}
      ref={setIframeElement}
      src={finalIframeUrl}
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
