import { delay } from '@/mocks/utils';
import { faker } from '@faker-js/faker';
import {
  EntityBankAccountPaginationResponse,
  ErrorSchemaResponse,
  BANK_ACCOUNTS_ENDPOINT,
  CreateEntityBankAccountRequest,
} from '@monite/sdk-api';

import { rest } from 'msw';

import { bankAccountsFixture } from './bankAccountsFixture';

export const bankAccountsHandlers = [
  rest.get<
    undefined,
    {},
    EntityBankAccountPaginationResponse | ErrorSchemaResponse
  >(`*${BANK_ACCOUNTS_ENDPOINT}`, (req, res, ctx) => {
    return res(delay(), ctx.status(200), ctx.json(bankAccountsFixture));
  }),

  rest.delete(`*${BANK_ACCOUNTS_ENDPOINT}/*`, (req, res, ctx) => {
    return res(delay(), ctx.status(400));
  }),

  rest.post<
    undefined,
    {},
    CreateEntityBankAccountRequest | ErrorSchemaResponse
  >(`*${BANK_ACCOUNTS_ENDPOINT}`, async (req, res, ctx) => {
    const payload = await req.json<CreateEntityBankAccountRequest>();
    return res(
      delay(),
      ctx.status(200),
      ctx.json({
        id: faker.string.uuid(),
        ...payload,
      })
    );
  }),
];
