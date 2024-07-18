import { components } from '@/api';

import { http, HttpResponse, delay } from 'msw';

import { vatRatesFixture } from './vatRatesFixture';

export const vatRatesHandlers = [
  http.get<{}, undefined, VatRateListResponse | ErrorSchemaResponse>(
    `*/vat_rates`,
    async () => {
      await delay();

      return HttpResponse.json(vatRatesFixture, {
        status: 200,
      });
    }
  ),
];

type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
type VatRateListResponse = components['schemas']['VatRateListResponse'];
