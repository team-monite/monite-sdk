import { MoniteApp } from '@team-monite/sdk-api';
import { initialize, mswDecorator } from 'msw-storybook-addon';

import MoniteProvider from '../src/core/context/ContextProvider';
import { handlers } from '../src/mocks/handlers';

export const parameters = {
  options: {
    storySort: {
      order: ['Payables', 'Counterparts', 'Approval Policies', 'Payments'],
    },
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  msw: {
    handlers,
  },
};

// Initialize MSW
initialize();

export const decorators = [
  mswDecorator,
  (Story) => {
    const monite = new MoniteApp({
      locale: 'en',
      apiUrl: '',
      token: '',
    });

    return (
      <MoniteProvider monite={monite}>
        <Story />
      </MoniteProvider>
    );
  },
];
