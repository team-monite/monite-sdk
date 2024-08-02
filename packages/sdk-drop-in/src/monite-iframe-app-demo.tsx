import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { MoniteIframeAppDemo } from '@/apps/MoniteIframeAppDemo';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <MoniteIframeAppDemo />
  </StrictMode>
);
