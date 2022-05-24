import { delay } from '@/mocks/utils';
import {
  ErrorSchemaResponse,
  VAT_RATES_ENDPOINT,
  VatRateListResponse,
} from '@monite/sdk-api';

import { rest } from 'msw';

import { vatRatesFixture } from './vatRatesFixture';

export const vatRatesHandlers = [
  rest.get<undefined, {}, VatRateListResponse | ErrorSchemaResponse>(
    `*/${VAT_RATES_ENDPOINT}`,
    (req, res, ctx) => {
      return res(delay(), ctx.status(200), ctx.json(vatRatesFixture));
    }
  ),
];
