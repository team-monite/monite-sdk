import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { THEMES } from '@monite/ui-widgets-react';
import { ThemeProvider } from 'emotion-theming';

import App from 'features/app/App';

const Root = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={THEMES.default}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default Root;
