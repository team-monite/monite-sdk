import React from 'react';
import ReactDOM from 'react-dom/client';

import { MoniteIframeApp } from '@/apps/MoniteIframeApp.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <MoniteIframeApp />
  </React.StrictMode>
);
