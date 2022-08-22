import { MoniteApp } from '@monite/js-sdk';

import MoniteProvider from '../src/core/context/ContextProvider';
import { MONITE_ENTITY_ID } from '../src/constants';
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
      apiKey: MONITE_ENTITY_ID,
      locale: 'en',
    });
    return (
      <MoniteProvider monite={monite}>
        <Story />
      </MoniteProvider>
    );
  },
];
