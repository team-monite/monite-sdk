import React from 'react';
import ReactDOM from 'react-dom/client';

import { MoniteIframeApp } from '@/iframe-app';
import { getConfig } from '@/lib/ConfigLoader';
import { createAPIClient } from '@monite/sdk-react';

(async function () {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  const { api, requestFn } = createAPIClient();

  const fetchMockedToken = async () => {
    const config = await getConfig();
    return await api.auth.postAuthToken(
      {
        body: {
          entity_user_id: config.entity_user_id,
          client_id: config.client_id,
          client_secret: config.client_secret,
          grant_type: 'entity_user',
        },
        baseUrl: `${config.api_url}/v1`,
        parameters: {},
      },
      requestFn
    );
  };

  root.render(
    <React.StrictMode>
      <MoniteIframeApp fetchToken={fetchMockedToken} />
    </React.StrictMode>
  );
})();
