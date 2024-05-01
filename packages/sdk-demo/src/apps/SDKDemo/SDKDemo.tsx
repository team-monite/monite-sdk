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
import { fetchToken } from '@/core/fetchToken';
import { getThemeConfig, useThemeConfig } from '@/hooks/useThemeConfig.tsx';
import { messages as defaultMessages } from '@/locales/en/messages.ts';
import { Global } from '@emotion/react';
import { setupI18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { I18nProvider, useLingui } from '@lingui/react';
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
  const sdkDemoTheme = createTheme(getThemeConfig(themeConfig));
  const [sdkDemoLocale, sdkDemoI18n] = useMemo(() => {
    const localeCode = 'en-US';
    return [
      {
        code: localeCode,
        messages: {
          defaultMessages,
        },
      },
      setupI18n({
        locale: localeCode,
        messages: {
          [localeCode]: defaultMessages,
        },
      }),
    ];
  }, []);

  return (
    <ThemeProvider theme={sdkDemoTheme}>
      <I18nProvider i18n={sdkDemoI18n}>
        <CssBaseline enableColorScheme />
        <AppMoniteProvider
          locale={sdkDemoLocale}
          theme={sdkDemoTheme}
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
      </I18nProvider>
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
