import React from 'react';
import { createRoot } from 'react-dom/client';

import { MoniteIframeApp } from '@/apps/MoniteIframeApp';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <MoniteIframeApp />
  </React.StrictMode>
);
