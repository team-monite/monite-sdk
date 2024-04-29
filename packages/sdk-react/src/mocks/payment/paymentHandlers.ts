import { receivableListFixture } from '@/mocks';
import { delay } from '@/mocks/utils';
import { faker } from '@faker-js/faker';
import {
  CreatePaymentLinkRequest,
  CurrencyEnum,
  ErrorSchemaResponse,
  MoniteAllPaymentMethodsTypes,
  PaymentAccountType,
  PublicPaymentLinkResponse,
  ReceivablesStatusEnum,
} from '@monite/sdk-api';

import { http, HttpResponse } from 'msw';

export const paymentHandlers = [
  http.post<
    {},
    CreatePaymentLinkRequest,
    PublicPaymentLinkResponse | ErrorSchemaResponse
  >('*/payment_links', async ({ request }) => {
    const json = await request.json();
    const bodyObject = json.object;

    if (bodyObject && bodyObject.type === 'receivable') {
      const invoice = receivableListFixture.invoice.find(
        (invoice) => invoice.id === bodyObject.id
      );

      if (!invoice) {
        await delay();

        return HttpResponse.json(
          {
            error: {
              message: 'Invoice not found',
            },
          },
          {
            status: 404,
          }
        );
      }

      if (invoice.status === ReceivablesStatusEnum.DRAFT) {
        await delay();

        return HttpResponse.json(
          {
            error: {
              message:
                'Can not create payment link for invoices in draft status',
            },
          },
          {
            status: 404,
          }
        );
      }
    }

    await delay();

    return HttpResponse.json(
      {
        id: faker.string.uuid(),
        payment_intent_id: faker.string.uuid(),
        payment_page_url: faker.internet.url(),
        status: 'active',
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
  }),
];
