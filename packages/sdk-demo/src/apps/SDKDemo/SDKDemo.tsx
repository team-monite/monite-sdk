import React, { StrictMode, Suspense } from 'react';
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
import { fetchToken } from '@/core/fetchToken';
import { getThemeConfig, useThemeConfig } from '@/hooks/useThemeConfig.tsx';
import { Global } from '@emotion/react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMoniteContext } from '@monite/sdk-react';
import { Button, createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { getFontFaceStyles } from './fontStyles.ts';

export const SDKDemo = () => {
  return (
    <StrictMode>
      <Suspense>
        <AuthCredentialsProvider>
          {(authProps) => (
            <ConfigProvider>
              <SDKDemoComponent {...authProps} />
            </ConfigProvider>
          )}
        </AuthCredentialsProvider>
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
  const muiTheme = createTheme(getThemeConfig(themeConfig));

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <AppMoniteProvider
        theme={muiTheme}
        sdkConfig={{
          entityId: authData?.entity_id ?? 'lazy',
          apiUrl,
          fetchToken: () =>
            authData
              ? fetchToken(apiUrl, authData).catch(logout)
              : Promise.reject(),
        }}
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
      </AppMoniteProvider>
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
