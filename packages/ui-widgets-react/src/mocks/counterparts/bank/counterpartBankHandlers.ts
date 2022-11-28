import { rest } from 'msw';

import {
  CounterpartData,
  COUNTERPARTS_BANK_ENDPOINT,
  COUNTERPARTS_ENDPOINT,
} from '@team-monite/sdk-api';

import type {
  CounterpartBankAccount,
  CounterpartBankAccountResponse,
} from '@team-monite/sdk-api';

import {
  counterpartBankFixture,
  counterpartBankListFixture,
} from './counterpartBankFixture';

type CreateCounterpartBankAccountParams = { counterpartId: string };
type UpdateCounterpartBankAccountParams = CreateCounterpartBankAccountParams & {
  bankAccountId: string;
};

const bankAccountPath = `*/${COUNTERPARTS_ENDPOINT}/:counterpartId/${COUNTERPARTS_BANK_ENDPOINT}`;
const bankAccountIdPath = `${bankAccountPath}/:bankAccountId`;

export const counterpartBankHandlers = [
  // read list
  rest.get<
    undefined,
    CreateCounterpartBankAccountParams,
    CounterpartData<CounterpartBankAccountResponse[]>
  >(bankAccountPath, (req, res, ctx) => {
    return res(ctx.json({ data: counterpartBankListFixture }));
  }),

  // create
  rest.post<
    CounterpartBankAccount,
    CreateCounterpartBankAccountParams,
    CounterpartBankAccountResponse
  >(bankAccountPath, (req, res, ctx) => {
    return res(ctx.json(counterpartBankFixture));
  }),

  // read
  rest.get<
    undefined,
    UpdateCounterpartBankAccountParams,
    CounterpartBankAccountResponse
  >(bankAccountIdPath, (req, res, ctx) => {
    return res(ctx.json(counterpartBankFixture));
  }),

  // update
  rest.patch<
    CounterpartBankAccount,
    UpdateCounterpartBankAccountParams,
    CounterpartBankAccountResponse
  >(bankAccountIdPath, (req, res, ctx) => {
    return res(ctx.json(counterpartBankFixture));
  }),

  // delete
  rest.delete<undefined, UpdateCounterpartBankAccountParams, boolean>(
    bankAccountIdPath,
    (req, res, ctx) => {
      return res(ctx.json(true));
    }
  ),
];
