import { delay } from '@/mocks/utils';
import { faker } from '@faker-js/faker';
import {
  EntityBankAccountPaginationResponse,
  ErrorSchemaResponse,
  BANK_ACCOUNTS_ENDPOINT,
  CreateEntityBankAccountRequest,
  EntityBankAccountResponse,
} from '@monite/sdk-api';

import { http, HttpResponse } from 'msw';

import { bankAccountsFixture } from './bankAccountsFixture';

export const bankAccountsHandlers = [
  http.get<
    {},
    undefined,
    EntityBankAccountPaginationResponse | ErrorSchemaResponse
  >(`*${BANK_ACCOUNTS_ENDPOINT}`, async () => {
    await delay();

    return HttpResponse.json(bankAccountsFixture, {
      status: 200,
    });
  }),

  http.delete(`*${BANK_ACCOUNTS_ENDPOINT}/*`, async () => {
    await delay();

    return new HttpResponse(null, {
      status: 400,
    });
  }),

  http.post<
    {},
    CreateEntityBankAccountRequest,
    EntityBankAccountResponse | ErrorSchemaResponse
  >(`*${BANK_ACCOUNTS_ENDPOINT}`, async ({ request }) => {
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
