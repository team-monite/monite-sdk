import { components } from '@/api';
import { receivableListFixture, paymentIntentFilterObjectID } from '@/mocks';
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

  http.get<{}, {}, components['schemas']['PaymentIntentResponse']>(
    '*/payment_intents',
    async ({ request }) => {
      const url = new URL(request.url);
      const objectId = url.searchParams.get('object_id');

      if (objectId === 'waiting-to-be-paid-id') {
        await delay();
        return HttpResponse.json(paymentIntentFilterObjectID, { status: 200 });
      } else {
        return HttpResponse.json(undefined, { status: 404 });
      }
    }
  ),

  http.get<{}, {}, components['schemas']['PublicPaymentLinkResponse']>(
    '*/payment_links/:id',
    async () => {
      await delay();

      return HttpResponse.json(
        {
          id: faker.string.uuid(),
          payment_intent_id: faker.string.uuid(),
          payment_page_url: faker.internet.url(),
          status: 'active',
          amount: 1,
          currency: 'EUR',
          expires_at: new Date().toISOString(),
          payment_methods: ['card', 'sepa_credit'],
          recipient: {
            id: faker.string.uuid(),
            type: 'entity',
          },
        },
        { status: 200 }
      );
    }
  ),
];

type CreatePaymentLinkRequest =
  components['schemas']['CreatePaymentLinkRequest'];
type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
type PublicPaymentLinkResponse =
  components['schemas']['PublicPaymentLinkResponse'];
type MoniteAllPaymentMethodsTypes =
  components['schemas']['MoniteAllPaymentMethodsTypes'];
