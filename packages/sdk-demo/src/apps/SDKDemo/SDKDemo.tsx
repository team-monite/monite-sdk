import React, { lazy, ReactNode, StrictMode, Suspense, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Base } from '@/apps/Base';
import { AppMoniteProvider } from '@/components/AppMoniteProvider';
import {
  AuthCredentialsProvider,
  AuthCredentialsProviderForwardProps,
} from '@/components/AuthCredentialsProvider';
import { DefaultLayout } from '@/components/Layout';
import { LoginForm } from '@/components/LoginForm';
import { ThemeContextProvider } from '@/context/themeContext';
import { fetchToken } from '@/core/fetchToken';
import { ConfigSchema, getConfig } from '@/core/getConfig';
import { getResetStyles } from '@/core/getResetStyles';
import { Global } from '@emotion/react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button } from '@mui/material';

import { getFontFaceStyles } from './fontStyles.ts';

export const SDKDemo = () => {
  const ConfigProvider = useMemo(() => {
    return lazy(async () => {
      const config = await getConfig();

      return {
        default: function ConfigProvider({
          children,
        }: {
          children: (props: ConfigSchema) => ReactNode;
        }) {
          return <>{children(config)}</>;
        },
      };
    });
  }, []);

  return (
    <StrictMode>
      <Suspense>
        <AuthCredentialsProvider>
          {(authProps) => (
            <ConfigProvider>
              {(configProps) => (
                <SDKDemoComponent {...authProps} {...configProps} />
              )}
            </ConfigProvider>
          )}
        </AuthCredentialsProvider>
      </Suspense>
    </StrictMode>
  );
};

const SDKDemoComponent = ({
  api_url,
  logout,
  login,
  authData,
}: ConfigSchema & AuthCredentialsProviderForwardProps) => {
  const apiUrl = `${api_url}/v1`;

  return (
    <ThemeContextProvider>
      <AppMoniteProvider
        sdkConfig={{
          entityId: authData?.entity_id ?? 'lazy',
          apiUrl,
          fetchToken: () =>
            authData
              ? fetchToken(apiUrl, authData).catch(logout)
              : Promise.reject(),
        }}
      >
        <Global styles={getFontFaceStyles} />
        <Global styles={getResetStyles} />
        {authData ? (
          <BrowserRouter>
            <DefaultLayout
              siderProps={{ footer: <SiderFooter onLogout={logout} /> }}
            >
              <Base />
            </DefaultLayout>
          </BrowserRouter>
        ) : (
          <LoginForm login={login} />
        )}
      </AppMoniteProvider>
    </ThemeContextProvider>
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
