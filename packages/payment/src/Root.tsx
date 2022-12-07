import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';

import { MoniteProvider } from '@team-monite/ui-widgets-react';
import { MoniteApp } from '@team-monite/sdk-api';
import { Tooltip, THEMES } from '@team-monite/ui-kit-react';

import { ROUTES } from './consts';

import PaymentPage from 'pages/PaymentPage';
import PaymentResultPage from 'pages/PaymentResultPage';
import PaymentExpiredPage from 'pages/PaymentExpiredPage';

const Root = () => {
  //TODO why do we need it?
  const monite = new MoniteApp({
    apiUrl: 'https://api.dev.monite.com/v1',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7ImNsaWVudF9pZCI6IjU5YTIzMGUyLWRjMzctNGNmMC04Njk3LTNiMDBhMjM3NTY0MSIsImNyZWF0ZWRfYXQiOiIyMDIyLTA5LTE1VDE2OjEyOjAzLjAwMjQ4NiJ9LCJleHAiOjE2NjMyNjAxMjN9.VsazsTnL3IelhSJGrIHuVqSJVhDM5NXjBJGpu0lkRSI',
    locale: 'en',
  });

  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={THEMES.default}>
          <MoniteProvider monite={monite}>
            <div style={{ minHeight: '100vh' }}>
              <Routes>
                <Route path={'/*'} element={<PaymentPage />} />
                <Route path={ROUTES.result} element={<PaymentResultPage />} />
                <Route path={ROUTES.expired} element={<PaymentExpiredPage />} />
              </Routes>
            </div>
            <Tooltip />
          </MoniteProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default Root;
