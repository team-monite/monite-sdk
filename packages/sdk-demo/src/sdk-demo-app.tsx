import { createRoot } from 'react-dom/client';

import { SDKDemo } from '@/apps/SDKDemo';

(async function () {
  const root = createRoot(document.getElementById('root') as HTMLElement);

  root.render(<SDKDemo />);
})();
