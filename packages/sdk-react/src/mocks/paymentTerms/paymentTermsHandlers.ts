import { paymentTermsFixtures } from '@/mocks/paymentTerms/paymentTermsFixtures';
import {
  PAYMENT_TERMS_ENDPOINT,
  PaymentTermsListResponse,
} from '@monite/sdk-api';

import { rest } from 'msw';

export const paymentTermsHandlers = [
  rest.get<undefined, {}, PaymentTermsListResponse>(
    `*/${PAYMENT_TERMS_ENDPOINT}`,
    (_, res, ctx) => {
      return res(ctx.json(paymentTermsFixtures));
    }
  ),
];
