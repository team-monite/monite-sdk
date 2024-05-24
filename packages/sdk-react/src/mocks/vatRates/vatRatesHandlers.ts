import {
  ErrorSchemaResponse,
  VAT_RATES_ENDPOINT,
  VatRateListResponse,
} from '@monite/sdk-api';

import { http, HttpResponse, delay } from 'msw';

import { vatRatesFixture } from './vatRatesFixture';

export const vatRatesHandlers = [
  http.get<{}, undefined, VatRateListResponse | ErrorSchemaResponse>(
    `*/${VAT_RATES_ENDPOINT}`,
    async () => {
      await delay();

      return HttpResponse.json(vatRatesFixture, {
        status: 200,
      });
    }
  ),
];
