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
import { getResetStyles } from '@/core/getResetStyles';
import { useTheme } from '@/hooks/useTheme';
import { Global } from '@emotion/react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button } from '@mui/material';

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
  const { theme, themeConfig, setThemeConfig } = useTheme();
  const apiUrl = `${api_url}/v1`;

  return (
    <AppMoniteProvider
      theme={theme}
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
