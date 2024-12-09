import { components } from '@/api';
import { paymentTermsFixtures } from '@/mocks/paymentTerms/paymentTermsFixtures';
import { faker } from '@faker-js/faker';

import { http, HttpResponse, delay } from 'msw';

const paymentTermsPath = `*/payment_terms`;
const paymentTermsList = paymentTermsFixtures;

interface ErrorResponse {
  error: {
    message: string;
  };
}

export const paymentTermsHandlers = [
  http.get<{}, undefined, components['schemas']['PaymentTermsListResponse']>(
    paymentTermsPath,
    () => {
      return HttpResponse.json(paymentTermsList);
    }
  ),

  http.post<
    {},
    components['schemas']['PaymentTermsCreatePayload'],
    components['schemas']['PaymentTermsResponse']
  >(paymentTermsPath, async ({ request }) => {
    const payload = await request.json();
    const createdPaymentTerm = {
      id: faker.string.uuid(),
      ...payload,
    };

    await delay();
    paymentTermsList.data?.push(createdPaymentTerm);

    return HttpResponse.json(createdPaymentTerm, {
      status: 200,
    });
  }),

  http.patch<
    { id: string },
    components['schemas']['PaymentTermsUpdatePayload'],
    components['schemas']['PaymentTermsResponse'] | ErrorResponse
  >(`${paymentTermsPath}/:id`, async ({ request, params }) => {
    const payload = await request.json();

    await delay();

    const paymentTermIndex = paymentTermsList.data?.findIndex(
      (paymentTerm) => paymentTerm.id === params.id
    );

    if (!paymentTermsList.data) {
      paymentTermsList.data = [];
    }

    if (!paymentTermIndex) {
      return HttpResponse.json(
        {
          error: {
            message: 'Wrong paymentTerm id',
          },
        },
        {
          status: 403,
        }
      );
    }

    const { name, term_final } = paymentTermsList.data[paymentTermIndex] || {};
    const updatedPaymentTerm = {
      ...payload,
      name: payload.name || name,
      term_final: payload.term_final || term_final,
      id: params.id,
    };

    paymentTermsList.data[paymentTermIndex] = updatedPaymentTerm;

    return HttpResponse.json(updatedPaymentTerm, {
      status: 200,
    });
  }),

  http.delete<{ id: string }, {}>(
    `${paymentTermsPath}/:id`,
    async ({ params }) => {
      paymentTermsList.data = paymentTermsList.data?.filter(
        (paymentTerm) => paymentTerm.id !== params.id
      );

      return new HttpResponse(undefined, { status: 204 });
    }
  ),
];
