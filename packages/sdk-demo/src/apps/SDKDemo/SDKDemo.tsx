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
import { getThemeOptions, useThemeConfig } from '@/hooks/useThemeConfig.tsx';
import { Global } from '@emotion/react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { createAPIClient, useMoniteContext } from '@monite/sdk-react';
import { Logout } from '@mui/icons-material';
import {
  Alert,
  Backdrop,
  Button,
  createTheme,
  CssBaseline,
  Stack,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
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
  const { themeConfig, setThemeConfig } = useThemeConfig();
  const apiUrl = `${api_url}/v1`;
  const sdkDemoTheme = createTheme(getThemeOptions(themeConfig), {
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
      MoniteApprovalRequestStatusChip: {
        defaultProps: {
          icon: false,
        },
      },
      MoniteTablePagination: {
        defaultProps: {
          pageSizeOptions: [10, 15, 20],
        },
      },
    },
  });

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
    <ThemeProvider theme={sdkDemoTheme}>
      <SDKDemoI18nProvider localeCode="en-US">
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
                    theme={sdkDemoTheme}
                    sdkConfig={{
                      entityId,
                      apiUrl,
                      fetchToken,
                    }}
                  >
                    <MoniteReactQueryDevtools />
                    <Global styles={getFontFaceStyles} />
                    <BrowserRouter>
                      <DefaultLayout
                        themeConfig={themeConfig}
                        setThemeConfig={setThemeConfig}
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
    </ThemeProvider>
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
            Error: <code>{error.message}</code>
          </Alert>
        ))}
        {Boolean(errors.length) && (
          <Button
            startIcon={<Logout />}
            sx={{ ml: 1, alignSelf: 'center' }}
            variant="contained"
            onClick={(event) => {
              event.preventDefault();
              logout();
            }}
          >
            Logout
          </Button>
        )}
      </Stack>
    </Backdrop>
  );
};
