import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MoniteProvider } from '@team-monite/ui-widgets-react';
import { MoniteApp } from '@team-monite/sdk-api';

import App from './App';

const Root = () => {
  //TODO why do we need it?
  const moniteApp = new MoniteApp({
    apiUrl: 'https://api.dev.monite.com/v1',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7ImNsaWVudF9pZCI6IjU5YTIzMGUyLWRjMzctNGNmMC04Njk3LTNiMDBhMjM3NTY0MSIsImNyZWF0ZWRfYXQiOiIyMDIyLTA5LTE1VDE2OjEyOjAzLjAwMjQ4NiJ9LCJleHAiOjE2NjMyNjAxMjN9.VsazsTnL3IelhSJGrIHuVqSJVhDM5NXjBJGpu0lkRSI',
    locale: 'en',
  });

  return (
    <React.StrictMode>
      <BrowserRouter>
        <MoniteProvider monite={moniteApp}>
          <App />
        </MoniteProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default Root;
