import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { THEMES } from '@monite/react-kit';
import { ThemeProvider } from 'emotion-theming';
import { StoreContext, store } from 'features/mobx';

import App from 'features/app/App';

const Root = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider
          theme={{
            // here we can override theme for the local @emotion/styled components
            ...THEMES.default,
            // an example
            colors: { ...THEMES.default.colors, lightGrey3: '#F3F3F3' },
          }}
        >
          <StoreContext.Provider value={store}>
            <App key={store.auth.authUserToken} />
          </StoreContext.Provider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default Root;
