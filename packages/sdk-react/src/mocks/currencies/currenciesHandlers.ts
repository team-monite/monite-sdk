import { components } from '@/api';

import { http, HttpResponse, delay } from 'msw';

import { currenciesFixture } from './currenciesFixture';

const currenciesPath = `*/internal/currencies`;
export const currenciesHandlers = [
  http.get<
    {},
    undefined,
    Record<string, components['schemas']['CurrencyDetails']>
  >(currenciesPath, async () => {
    await delay();

    return HttpResponse.json(currenciesFixture);
  }),
];
