import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MoniteProvider } from '@team-monite/ui-widgets-react';
import { MoniteApp } from '@team-monite/sdk-api';

import App from 'features/app/App';
import AuthProvider from 'features/auth/AuthProvider';

import { AUTH_TOKEN_STORAGE_KEY } from './consts';

const Root = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = () => {
      const localStorageToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

      if (localStorageToken) setToken(localStorageToken);
    };

    window.addEventListener('storage', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, []);

  const monite = new MoniteApp({
    token: token || localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '',
    apiUrl: 'https://api.dev.monite.com/v1',
    locale: 'en',
    entityId: 'ec74ceb6-d1ef-4898-b5b3-d2520a52c073',
  });

  return (
    <React.StrictMode>
      <BrowserRouter>
        <MoniteProvider
          monite={monite}
          // REPLACE {} WITH CUSTOM THEME OBJECT OR SET INDIVIDUAL COLORS
          theme={{}}
        >
          <AuthProvider>
            <App />
          </AuthProvider>
        </MoniteProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default Root;
