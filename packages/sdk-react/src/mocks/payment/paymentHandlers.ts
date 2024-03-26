import { delay } from '@/mocks/utils';
import { faker } from '@faker-js/faker';
import {
  CreatePaymentLinkRequest,
  CurrencyEnum,
  ErrorSchemaResponse,
  MoniteAllPaymentMethodsTypes,
  PaymentAccountType,
} from '@monite/sdk-api';

import { rest } from 'msw';

export const paymentHandlers = [
  rest.post<undefined, {}, CreatePaymentLinkRequest | ErrorSchemaResponse>(
    '*/payment_links',
    (req, res, ctx) => {
      return res(
        delay(),
        ctx.status(200),
        ctx.json({
          amount: 1,
          currency: CurrencyEnum.EUR,
          expires_at: new Date().toISOString(),
          payment_methods: [
            MoniteAllPaymentMethodsTypes.CARD,
            MoniteAllPaymentMethodsTypes.SEPA_CREDIT,
          ],
          recipient: {
            id: faker.string.uuid(),
            type: PaymentAccountType.ENTITY,
          },
        })
      );
    }
  ),
];
