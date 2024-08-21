import { components } from '@/api';
import { faker } from '@faker-js/faker';

import { http, HttpResponse, delay } from 'msw';

import { bankAccountsFixture } from './bankAccountsFixture';

export const bankAccountsHandlers = [
  http.get<
    {},
    undefined,
    EntityBankAccountPaginationResponse | ErrorSchemaResponse
  >(`*/bank_accounts`, async () => {
    await delay();

    return HttpResponse.json(bankAccountsFixture, {
      status: 200,
    });
  }),

  http.delete(`*/bank_accounts/*`, async () => {
    await delay();

    return new HttpResponse(null, {
      status: 400,
    });
  }),

  http.post<
    {},
    CreateEntityBankAccountRequest,
    EntityBankAccountResponse | ErrorSchemaResponse
  >(`*/bank_accounts`, async ({ request }) => {
    const payload = await request.json();

    await delay();

    return HttpResponse.json(
      {
        id: faker.string.uuid(),
        ...payload,
      },
      {
        status: 200,
      }
    );
  }),
];

type EntityBankAccountPaginationResponse =
  components['schemas']['EntityBankAccountPaginationResponse'];
type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
type CreateEntityBankAccountRequest =
  components['schemas']['CreateEntityBankAccountRequest'];
type EntityBankAccountResponse =
  components['schemas']['EntityBankAccountResponse'];
