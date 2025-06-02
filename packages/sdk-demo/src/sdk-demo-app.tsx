// eslint-disable-next-line no-restricted-imports
import React from 'react';
import { createRoot } from 'react-dom/client';

import { SDKDemo } from '@/apps/SDKDemo';

(window as unknown as { React: typeof React }).React = React;

(async function () {
  const root = createRoot(document.getElementById('root') as HTMLElement);

  root.render(<SDKDemo />);
})();
