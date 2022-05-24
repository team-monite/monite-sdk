import React from 'react';
import ReactDOM from 'react-dom/client';

import 'antd/dist/antd.less';
import '@monite/react-kit/dist/esm/monite.css';
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
