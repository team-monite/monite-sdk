import { MoniteApp } from '@monite/sdk-api';

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
      entityId: 'ec74ceb6-d1ef-4898-b5b3-d2520a52c073',
      apiKey:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7ImNsaWVudF9pZCI6ImQ0ZmM5M2MzLWRhZjctNDQ0Yi04YzNiLTZhOWU2MmJmN2FhMyIsImNyZWF0ZWRfYXQiOiIyMDIyLTA5LTA5VDA4OjI1OjE1Ljc5NDE0NiJ9LCJleHAiOjE2NjI3MTM3MTV9.liueD5GpAXRvCvTZrUrryxnI66SdxrtllzY6hapCAPA',
    });

    return (
      <MoniteProvider monite={monite}>
        <Story />
      </MoniteProvider>
    );
  },
];
