import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MoniteProvider, ApiService, OpenAPIConfig } from '@monite/react-kit';

import App from 'features/app/App';

export const moniteApiConfig: Partial<OpenAPIConfig> = {
  HEADERS: {
    'x-api-key': 'en-52cefd74-c7f2-4e3b-8ba9-61b4cf405cce', // some public API key available for test
  },
};

const Root = () => {
  const moniteApi = new ApiService({ config: moniteApiConfig });

  return (
    <React.StrictMode>
      <BrowserRouter>
        <MoniteProvider api={moniteApi}>
          <App />
        </MoniteProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default Root;
