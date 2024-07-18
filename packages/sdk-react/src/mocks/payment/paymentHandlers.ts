import { components } from '@/api';
import { receivableListFixture } from '@/mocks';
import { faker } from '@faker-js/faker';

import { http, HttpResponse, delay } from 'msw';

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

      if (invoice.status === 'draft') {
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

    const paymentMethods: MoniteAllPaymentMethodsTypes[] = [
      'card',
      'sepa_credit',
    ];

    return HttpResponse.json(
      {
        id: faker.string.uuid(),
        payment_intent_id: faker.string.uuid(),
        payment_page_url: faker.internet.url(),
        status: 'active',
        amount: 1,
        currency: 'EUR',
        expires_at: new Date().toISOString(),
        payment_methods: paymentMethods,
        recipient: {
          id: faker.string.uuid(),
          type: 'entity',
        },
      },
      {
        status: 200,
      }
    );
  }),
];

type CreatePaymentLinkRequest =
  components['schemas']['CreatePaymentLinkRequest'];
type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
type PaymentAccountType = components['schemas']['PaymentAccountType'];
type PublicPaymentLinkResponse =
  components['schemas']['PublicPaymentLinkResponse'];

type MoniteAllPaymentMethodsTypes =
  components['schemas']['MoniteAllPaymentMethodsTypes'];
