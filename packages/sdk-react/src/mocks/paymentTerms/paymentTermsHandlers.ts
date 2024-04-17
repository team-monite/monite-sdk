import { paymentTermsFixtures } from '@/mocks/paymentTerms/paymentTermsFixtures';
import {
  PAYMENT_TERMS_ENDPOINT,
  PaymentTermsListResponse,
} from '@monite/sdk-api';

import { http, HttpResponse } from 'msw';

export const paymentTermsHandlers = [
  http.get<{}, undefined, PaymentTermsListResponse>(
    `*/${PAYMENT_TERMS_ENDPOINT}`,
    () => {
      return HttpResponse.json(paymentTermsFixtures);
    }
  ),
];
