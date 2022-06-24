import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  MoniteProvider,
  MoniteApp,
  MoniteAppConfig,
  THEMES,
} from '@monite/react-kit';
import { ThemeProvider } from 'emotion-theming';

import App from 'features/app/App';

export const moniteApiConfig: MoniteAppConfig = {
  apiKey: 'en-52cefd74-c7f2-4e3b-8ba9-61b4cf405cce', // some public API key available for test
  locale: 'en',
};

const Root = () => {
  const monite = new MoniteApp(moniteApiConfig);

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
          <MoniteProvider
            monite={monite}
            theme={{
              // here we can override theme for the react-kit UI components
              ...THEMES.default,
              // an example
              colors: { ...THEMES.default.colors, grey: '#707070' },
            }}
          >
            <App />
          </MoniteProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default Root;
