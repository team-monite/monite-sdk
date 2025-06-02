import './buffer-polyfill.js';

// import { Buffer } from 'buffer';

// Ensure Buffer is on window object as early as possible.
// if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
// window.Buffer = Buffer;
// console.log('[Storybook preview.js] Manually set window.Buffer');
// }

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// import { initialize, mswLoader } from 'msw-storybook-addon';

// import { handlers } from '../src/mocks/handlers';
import { withGlobalStorybookDecorator } from '../src/utils/storybook-utils';

/**
 * Turn to `false` to make real requests to the server.
 * Otherwise, all requests will be mocked by `mock service worker` package
 */
const mockedRequests = true;

const decorators = [withGlobalStorybookDecorator()];

// Initialize MSW
// initialize();

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    layout: 'fullscreen',
    options: {
      storySort: {
        order: [
          'Payables',
          'Approval Requests',
          'Counterparts',
          'Approval Policies',
          'Payments',
        ],
      },
    },
    backgrounds: { disable: true },
    actions: { argTypesRegex: '^on[A-Z].*' },
    // msw: {
    //   handlers,
    // },
  },
  // loaders: [mswLoader],
  loaders: [],
  decorators,
};

export default preview;
