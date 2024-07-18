import { components } from '@/api';
import { paymentTermsFixtures } from '@/mocks/paymentTerms/paymentTermsFixtures';

import { http, HttpResponse } from 'msw';

export const paymentTermsHandlers = [
  http.get<{}, undefined, components['schemas']['PaymentTermsListResponse']>(
    `*/payment_terms`,
    () => {
      return HttpResponse.json(paymentTermsFixtures);
    }
  ),
];
