import { paymentTermsFixtures } from '@/mocks/paymentTerms/paymentTermsFixtures';
import { components } from '@monite/sdk-api/src/api';

import { http, HttpResponse } from 'msw';

export const paymentTermsHandlers = [
  http.get<{}, undefined, components['schemas']['PaymentTermsListResponse']>(
    `*/payment_terms`,
    () => {
      return HttpResponse.json(paymentTermsFixtures);
    }
  ),
];
