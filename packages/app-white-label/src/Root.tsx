import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoreContext, store } from 'features/mobx';
import { MoniteProvider, MoniteApp } from '@monite/ui-widgets-react';

import App from 'features/app/App';

const Root = () => {
  const monite = new MoniteApp({
    apiKey: store.auth.authUserToken || '',
    locale: 'en',
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
            <App key={store.auth.authUserToken} />
          </MoniteProvider>
        </StoreContext.Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default Root;
