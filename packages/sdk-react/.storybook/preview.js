// Import CSS directly - they will be handled by webpack
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { initialize, mswLoader } from 'msw-storybook-addon';

import { handlers } from '../src/mocks/handlers';
import { withGlobalStorybookDecorator } from '../src/utils/storybook-utils';

/**
 * Turn to `false` to make real requests to the server.
 * Otherwise, all requests will be mocked by `mock service worker` package
 */
const mockedRequests = true;

const decorators = [withGlobalStorybookDecorator()];

// Initialize MSW
initialize();

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
    actions: { 
      // In Storybook 8, use the fn() function from @storybook/test instead of argTypesRegex 
      // for mocking component methods in play functions
    },
    msw: {
      handlers,
    },
  },
  loaders: [mswLoader],
  decorators,
};

export default preview;
