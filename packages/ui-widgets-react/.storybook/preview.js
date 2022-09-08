import { MoniteApp } from '@monite/sdk-api';

import MoniteProvider from '../src/core/context/ContextProvider';
import './main.css';

export const parameters = {
  // viewMode: 'docs',
  options: {
    storySort: {
      order: ['Common', 'Payables', 'In Progress'],
    },
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (Story) => {
    const monite = new MoniteApp({
      locale: 'en',
    });

    return (
      <MoniteProvider monite={monite}>
        <Story />
      </MoniteProvider>
    );
  },
];
