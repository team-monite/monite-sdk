import { ReactNode, useCallback, useMemo } from 'react';
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
    if (!authDataRaw) return undefined;

    return typeof authDataRaw === 'object' &&
      authDataRaw.entity_user_id &&
      authDataRaw.client_id &&
      authDataRaw.client_secret
      ? authDataRaw
      : new Error('Invalid auth data');
  }, [authDataRaw]);

  const login = useCallback(
    (auth: AuthCredentials) => setAuthData(auth),
    [setAuthData]
  );

  return { login, logout, authData };
};

export type AuthCredentialsProviderForwardProps = {
  login: (auth: AuthCredentials) => void;
  logout: () => void;
  authData: AuthCredentials | Error | undefined;
};
