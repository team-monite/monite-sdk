import { delay } from '@/mocks/utils';
import { faker } from '@faker-js/faker';
import {
  CreatePaymentLinkRequest,
  CurrencyEnum,
  ErrorSchemaResponse,
  MoniteAllPaymentMethodsTypes,
  PaymentAccountType,
} from '@monite/sdk-api';

import { http, HttpResponse } from 'msw';

export const paymentHandlers = [
  http.post<{}, undefined, CreatePaymentLinkRequest | ErrorSchemaResponse>(
    '*/payment_links',
    async () => {
      await delay();

      return HttpResponse.json(
        {
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
        },
        {
          status: 200,
        }
      );
    }
  ),
];
