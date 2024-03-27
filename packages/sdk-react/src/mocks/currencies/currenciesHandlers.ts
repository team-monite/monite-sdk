import { CurrencyDetails, CURRENCIES_ENDPOINT } from '@monite/sdk-api';

import { rest } from 'msw';

import { currenciesFixture } from './currenciesFixture';

const currenciesPath = `*/${CURRENCIES_ENDPOINT}`;
export const currenciesHandlers = [
  rest.get<undefined, {}, Record<string, CurrencyDetails>>(
    currenciesPath,
    ({ url }, res, ctx) => {
      return res(ctx.json(currenciesFixture));
    }
  ),
];
