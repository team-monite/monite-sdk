import React from 'react';
import ReactDOM from 'react-dom/client';

import './reset.scss';
import './index.css';

import { init as i18nInit } from 'features/i18n';
import Root from './Root';

(async function () {
  await i18nInit();

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(<Root />);
})();
