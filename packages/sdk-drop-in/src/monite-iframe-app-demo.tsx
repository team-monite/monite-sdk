import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { MoniteIframeAppDemo } from '@/apps/MoniteIframeAppDemo';

if (typeof document !== 'undefined') {
  const rootElement = document.getElementById('root') as HTMLElement;

  if (rootElement) {
    const root = createRoot(rootElement);

    root.render(
      <StrictMode>
        <MoniteIframeAppDemo />
      </StrictMode>
    );
  }
}
