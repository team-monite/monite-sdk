import React, { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from 'react-use';

import { MONITE_AUTH_CREDENTIALS_LOCAL_STORAGE_KEY } from '@/core/consts';
import type { AuthCredentials } from '@/core/fetchToken';

export const AuthCredentialsProvider = ({
  children,
}: {
  children: (props: AuthCredentialsProviderForwardProps) => ReactNode;
}) => {
  return <>{children(useAuth())}</>;
};

const useAuth = (): AuthCredentialsProviderForwardProps => {
  const [authDataRaw, setAuthData, logout] = useLocalStorage<AuthCredentials>(
    MONITE_AUTH_CREDENTIALS_LOCAL_STORAGE_KEY
  );

  const authData = useMemo(() => {
    return authDataRaw &&
      typeof authDataRaw === 'object' &&
      authDataRaw.entity_id &&
      authDataRaw.entity_user_id &&
      authDataRaw.client_id &&
      authDataRaw.client_secret
      ? authDataRaw
      : undefined;
  }, [authDataRaw]);

  const login = useCallback(
    (auth: AuthCredentials) => setAuthData(auth),
    [setAuthData]
  );

  useEffect(() => {
    if (authDataRaw && !authData) logout();
  }, [authData, authDataRaw, logout]);

  return { login, logout, authData };
};

export type AuthCredentialsProviderForwardProps = {
  login: (auth: AuthCredentials) => void;
  logout: () => void;
  authData: AuthCredentials | undefined;
};
