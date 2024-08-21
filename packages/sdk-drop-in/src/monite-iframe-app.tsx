import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { MoniteIframeApp } from '@/apps/MoniteIframeApp.tsx';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <MoniteIframeApp />
  </StrictMode>
);
