import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoreContext, store } from 'features/mobx';
import { MoniteProvider, MoniteApp } from '@team-monite/ui-widgets-react';

import App from 'features/app/App';
import { AUTH_TOKEN_STORAGE_KEY } from 'features/app/consts';

const Root = () => {
  const monite = new MoniteApp({
    token:
      store.auth.authUserToken ||
      localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
      '',
    apiUrl: 'https://api.dev.monite.com/v1',
    locale: 'en',
    entityId: '805622a2-3926-4eae-92ec-3d9bd375cfa9',
  });

  store.setMoniteApp(monite);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <StoreContext.Provider value={store}>
          <MoniteProvider
            monite={monite}
            // REPLACE {} WITH CUSTOM THEME OBJECT OR SET INDIVIDUAL COLORS
            theme={{}}
          >
            <App />
          </MoniteProvider>
        </StoreContext.Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default Root;
