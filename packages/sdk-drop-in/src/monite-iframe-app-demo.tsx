import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { MoniteIframeAppDemo } from '@/apps/MoniteIframeAppDemo';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <MoniteIframeAppDemo />
  </StrictMode>
);
