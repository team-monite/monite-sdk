import React from 'react';
import ReactDOM from 'react-dom/client';

import { MoniteIframeAppConsumer } from '@/apps/MoniteIframeAppConsumer.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <MoniteIframeAppConsumer />
  </React.StrictMode>
);
