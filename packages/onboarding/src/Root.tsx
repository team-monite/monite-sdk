import React, { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { MoniteProvider } from '@team-monite/ui-widgets-react';
import { MoniteApp } from '@team-monite/sdk-api';

import { OnboardingPage } from 'pages';

const Root = () => {
  const monite = new MoniteApp({
    apiUrl: 'https://api.dev.monite.com/v1',
    locale: 'en',
    token: '',
  });

  return (
    <StrictMode>
      <BrowserRouter>
        <MoniteProvider monite={monite}>
          <Routes>
            <Route path={'/*'} element={<OnboardingPage />} />
          </Routes>
        </MoniteProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default Root;
