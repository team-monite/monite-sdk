import React, { StrictMode, Suspense, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Base } from '@/apps/Base';
import { AppMoniteProvider } from '@/components/AppMoniteProvider';
import {
  AuthCredentialsProvider,
  AuthCredentialsProviderForwardProps,
} from '@/components/AuthCredentialsProvider';
import { DefaultLayout } from '@/components/Layout';
import { LoginForm } from '@/components/LoginForm';
import { ConfigProvider, useConfig } from '@/context/ConfigContext';
import { SDKDemoAPIProvider } from '@/context/SDKDemoAPIProvider.tsx';
import { SDKDemoI18nProvider } from '@/context/SDKDemoI18nProvider.tsx';
import { fetchToken as fetchTokenBase } from '@/core/fetchToken';
import { getThemeConfig, useThemeConfig } from '@/hooks/useThemeConfig.tsx';
import { Global } from '@emotion/react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMoniteContext } from '@monite/sdk-react';
import { Button, createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
  logout,
  login,
  authData,
}: AuthCredentialsProviderForwardProps) => {
  const { api_url } = useConfig();
  const { themeConfig, setThemeConfig } = useThemeConfig();
  const apiUrl = `${api_url}/v1`;
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

  const fetchToken = () =>
    authData
      ? fetchTokenBase(apiUrl, authData).catch(logout)
      : Promise.reject();

  return (
    <ThemeProvider theme={sdkDemoTheme}>
      <SDKDemoI18nProvider localeCode="en-US">
        <CssBaseline enableColorScheme />
        <AppMoniteProvider
          theme={sdkDemoTheme}
          sdkConfig={{
            entityId: authData?.entity_id ?? 'lazy',
            apiUrl,
            fetchToken,
          }}
        >
          <SDKDemoAPIProvider
            apiUrl={apiUrl}
            fetchToken={fetchToken}
            entityId={authData?.entity_id}
          >
            <MoniteReactQueryDevtools />
            <Global styles={getFontFaceStyles} />
            {authData ? (
              <BrowserRouter>
                <DefaultLayout
                  themeConfig={themeConfig}
                  setThemeConfig={setThemeConfig}
                  siderProps={{ footer: <SiderFooter onLogout={logout} /> }}
                >
                  <Base />
                </DefaultLayout>
              </BrowserRouter>
            ) : (
              <LoginForm login={login} />
            )}
          </SDKDemoAPIProvider>
        </AppMoniteProvider>
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
