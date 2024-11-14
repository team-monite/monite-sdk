import { StrictMode, Suspense, useCallback, useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Base } from '@/apps/Base';
import { AppMoniteProvider } from '@/components/AppMoniteProvider';
import {
  AuthCredentialsProvider,
  AuthCredentialsProviderForwardProps,
} from '@/components/AuthCredentialsProvider';
import { EntityIdLoader } from '@/components/EntityIdLoader';
import { DefaultLayout } from '@/components/Layout';
import { LoginForm } from '@/components/LoginForm';
import { ConfigProvider, useConfig } from '@/context/ConfigContext';
import { SDKDemoAPIProvider } from '@/context/SDKDemoAPIProvider.tsx';
import { SDKDemoI18nProvider } from '@/context/SDKDemoI18nProvider.tsx';
import { fetchToken as fetchTokenBase } from '@/core/fetchToken';
import { Global } from '@emotion/react';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { createAPIClient, useMoniteContext } from '@monite/sdk-react';
import { Logout } from '@mui/icons-material';
import { Alert, Backdrop, Button, CssBaseline, Stack } from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { getFontFaceStyles } from './fontStyles.ts';

export const SDKDemo = () => {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <StrictMode>
      <Suspense>
        <QueryClientProvider client={queryClient}>
          <AuthCredentialsProvider>
            {(authProps) => (
              <ConfigProvider>
                <SDKDemoComponent {...authProps} />
              </ConfigProvider>
            )}
          </AuthCredentialsProvider>
        </QueryClientProvider>
      </Suspense>
    </StrictMode>
  );
};

const SDKDemoComponent = ({
  logout: logoutCallback,
  login,
  authData,
}: AuthCredentialsProviderForwardProps) => {
  const { api_url } = useConfig();
  const apiUrl = `${api_url}/v1`;

  const [fetchTokenError, setFetchTokenError] = useState<Error | null>(null);
  const fetchToken = useCallback(async () => {
    try {
      if (!authData) throw new Error('Auth data is not provided');
      if (authData instanceof Error) throw authData;
      const token = await fetchTokenBase(apiUrl, authData);
      setFetchTokenError(null);
      return token;
    } catch (error) {
      setFetchTokenError(
        error instanceof Error ? error : new Error(JSON.stringify(error))
      );
    }
  }, [authData, apiUrl]);

  const { api } = createAPIClient();
  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    logoutCallback();
    setFetchTokenError(null);
    api.entityUsers.getEntityUsersMyEntity.resetQueries(queryClient);
  }, [logoutCallback, api, queryClient]);

  return (
    <SDKDemoI18nProvider localeCode={navigator.language}>
      <CssBaseline enableColorScheme />
      <AuthErrorsBackdrop
        errors={[fetchTokenError, authData].filter(
          (error) => error instanceof Error
        )}
        logout={logout}
      />

      {authData === undefined && !fetchTokenError && (
        <LoginForm login={login} />
      )}
      {authData && !(authData instanceof Error) && (
        <Suspense>
          <EntityIdLoader fetchToken={fetchToken} apiUrl={apiUrl}>
            {(entityId) => (
              <SDKDemoAPIProvider
                apiUrl={apiUrl}
                entityId={entityId}
                fetchToken={fetchToken}
              >
                <AppMoniteProvider
                  sdkConfig={{
                    entityId,
                    apiUrl,
                    fetchToken,
                  }}
                  // TODO: remove this once we find a better way to test theme config
                  theme={{
                    colors: {
                      primary: '#eb3333',
                      secondary: '#b3f192',
                      neutral: '#cd12ae',

                      background: '#ead391',

                      text: '#242dd3',
                    },
                    typography: {
                      fontFamily: 'monospace',
                      fontSize: 14,

                      h1: {
                        fontSize: 10,
                        fontWeight: 100,
                        lineHeight: '10px',
                      },
                      h2: {
                        fontSize: 10,
                        fontWeight: 100,
                        lineHeight: '10px',
                      },
                      h3: {
                        fontSize: 12,
                        fontWeight: 100,
                        lineHeight: '10px',
                      },
                      subtitle1: {
                        fontSize: 10,
                        fontWeight: 100,
                        lineHeight: '10px',
                      },
                      subtitle2: {
                        fontSize: 10,
                        fontWeight: 100,
                        lineHeight: '10px',
                      },
                      body1: {
                        fontSize: 10,
                        fontWeight: 100,
                        lineHeight: '10px',
                      },
                      body2: {
                        fontSize: 10,
                        fontWeight: 100,
                        lineHeight: '10px',
                      },
                    },
                  }}
                >
                  <MoniteReactQueryDevtools />
                  <Global styles={getFontFaceStyles} />
                  <BrowserRouter>
                    <DefaultLayout
                      siderProps={{
                        footer: <SiderFooter onLogout={logout} />,
                      }}
                    >
                      <Base />
                    </DefaultLayout>
                  </BrowserRouter>
                </AppMoniteProvider>
              </SDKDemoAPIProvider>
            )}
          </EntityIdLoader>
        </Suspense>
      )}
    </SDKDemoI18nProvider>
  );
};

const SiderFooter = ({ onLogout }: { onLogout: () => void }) => {
  const { i18n } = useLingui();

  return (
    <Button onClick={onLogout} variant="outlined">
      {t(i18n)`Logout`}
    </Button>
  );
};

const MoniteReactQueryDevtools = () => {
  const { queryClient } = useMoniteContext();
  return <ReactQueryDevtools initialIsOpen={false} client={queryClient} />;
};

const AuthErrorsBackdrop = ({
  errors,
  logout,
}: {
  errors: Array<Error>;
  logout: () => void;
}) => {
  const { i18n } = useLingui();

  if (!errors.length) return null;

  return (
    <Backdrop open>
      <Stack
        spacing={2}
        maxWidth="sm"
        margin="auto"
        height="100vh"
        justifyContent="center"
      >
        {errors.map((error) => (
          <Alert severity="error" key={error.message}>
            <Trans>
              Error: <code>{error.message}</code>
            </Trans>
          </Alert>
        ))}
        <Button
          startIcon={<Logout />}
          sx={{ ml: 1, alignSelf: 'center' }}
          variant="contained"
          onClick={(event) => {
            event.preventDefault();
            logout();
          }}
        >
          {t(i18n)`Logout`}
        </Button>
      </Stack>
    </Backdrop>
  );
};
