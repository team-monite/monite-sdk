import { handlers } from '../src/mocks/handlers';
import { withGlobalStorybookDecorator } from '../src/utils/storybook-utils';
import { initialize, mswLoader } from 'msw-storybook-addon';

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
    actions: { argTypesRegex: '^on[A-Z].*' },
    msw: {
      handlers,
    },
  },
  loaders: [mswLoader],
  decorators,
};

export default preview;
