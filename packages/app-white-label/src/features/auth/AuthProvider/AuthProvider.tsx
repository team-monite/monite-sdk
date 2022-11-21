import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GrantType } from '@team-monite/sdk-api';
import { useComponentsContext } from '@team-monite/ui-widgets-react';

import { AUTH_TOKEN_STORAGE_KEY } from 'consts';
import { LoginFormValues, ContextValue } from '../types';

type Props = {
  children?: React.ReactNode;
};

export const AuthContext = React.createContext<ContextValue | null>(null);

const AuthProvider = ({ children }: Props) => {
  const { monite } = useComponentsContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = React.useState<string | null>(
    localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || null
  );

  const handleLogin = async (data: LoginFormValues): Promise<string | null> => {
    try {
      const res = await monite?.api.auth.getAuthToken({
        grant_type: GrantType.ENTITY_USER,
        client_id: data.email,
        client_secret: data.password,
        entity_user_id: '5b4daced-6b9a-4707-83c6-08193d999fab',
      });

      setToken(res.access_token);
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, res.access_token);
      window.dispatchEvent(new Event('storage'));

      const origin = location.state?.from?.pathname || '/';

      navigate(origin);

      return res.access_token;
    } catch (err) {
      return null;
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
  };

  const value: ContextValue = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
