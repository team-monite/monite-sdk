import { MoniteApp } from '@monite/js-sdk';

import MoniteProvider from '../src/core/context/ContextProvider';

import './main.css';

export const parameters = {
  viewMode: 'docs',
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => {
    const monite = new MoniteApp({
      // apiKey: '',
    });
    return (
      <MoniteProvider monite={monite}>
        <Story />
      </MoniteProvider>
    );
  },
];
