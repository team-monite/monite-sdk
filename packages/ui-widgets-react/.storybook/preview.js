import { MoniteApp } from '@team-monite/sdk-api';

import MoniteProvider from '../src/core/context/ContextProvider';

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
      entityId: '805622a2-3926-4eae-92ec-3d9bd375cfa9',
      token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7ImNsaWVudF9pZCI6IjU5YTIzMGUyLWRjMzctNGNmMC04Njk3LTNiMDBhMjM3NTY0MSIsImNyZWF0ZWRfYXQiOiIyMDIyLTA5LTE1VDE2OjEyOjAzLjAwMjQ4NiJ9LCJleHAiOjE2NjMyNjAxMjN9.VsazsTnL3IelhSJGrIHuVqSJVhDM5NXjBJGpu0lkRSI',
    });

    return (
      <MoniteProvider monite={monite}>
        <Story />
      </MoniteProvider>
    );
  },
];
