import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MoniteProvider, MoniteApp, MoniteAppConfig } from '@monite/react-kit';

import App from 'features/app/App';

export const moniteApiConfig: MoniteAppConfig = {
  apiKey: 'en-52cefd74-c7f2-4e3b-8ba9-61b4cf405cce', // some public API key available for test
};

const Root = () => {
  const monite = new MoniteApp(moniteApiConfig);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <MoniteProvider monite={monite}>
          <App />
        </MoniteProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default Root;
