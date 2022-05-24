import {
  CounterpartData,
  COUNTERPARTS_BANK_ENDPOINT,
  COUNTERPARTS_ENDPOINT,
} from '@monite/sdk-api';
import type {
  CreateCounterpartBankAccount,
  CounterpartBankAccountResponse,
  UpdateCounterpartBankAccount,
} from '@monite/sdk-api';

import { rest } from 'msw';

import {
  counterpartBankFixture,
  counterpartBankListFixture,
  genCounterpartBankFixture,
} from './counterpartBankFixture';

type CreateCounterpartBankAccountParams = { counterpartId: string };
type UpdateCounterpartBankAccountParams = CreateCounterpartBankAccountParams & {
  bankAccountId: string;
};

const bankAccountPath = `*/${COUNTERPARTS_ENDPOINT}/:counterpartId/${COUNTERPARTS_BANK_ENDPOINT}`;
const bankAccountIdPath = `${bankAccountPath}/:bankAccountId`;

let bankAccountId = 1;

export const counterpartBankHandlers = [
  /**
   * Get counterpart bank account list
   */
  rest.get<
    undefined,
    CreateCounterpartBankAccountParams,
    CounterpartData<CounterpartBankAccountResponse[]>
  >(bankAccountPath, (req, res, ctx) => {
    return res(ctx.json({ data: counterpartBankListFixture }));
  }),

  /**
   * Create counterpart bank account
   */
  rest.post<
    CreateCounterpartBankAccount,
    CreateCounterpartBankAccountParams,
    CounterpartBankAccountResponse
  >(bankAccountPath, async (req, res, ctx) => {
    const json = await req.json<CreateCounterpartBankAccount>();

    const response: CounterpartBankAccountResponse = {
      id: String(++bankAccountId),
      counterpart_id: counterpartBankFixture.counterpart_id,
      name: json.name,
      bic: json.bic,
      iban: json.iban,
      account_holder_name: json.account_holder_name,
      account_number: json.account_number,
      country: json.country,
      currency: json.currency,
      routing_number: json.routing_number,
      sort_code: json.sort_code,
    };

    return res(ctx.json(response));
  }),

  /**
   * Read counterpart bank account
   */
  rest.get<
    undefined,
    UpdateCounterpartBankAccountParams,
    CounterpartBankAccountResponse
  >(bankAccountIdPath, (req, res, ctx) => {
    const { bankAccountId } = req.params;
    const fixture =
      genCounterpartBankFixture(bankAccountId) || genCounterpartBankFixture();

    return res(ctx.json(fixture));
  }),

  /**
   * Update counterpart bank account
   */
  rest.patch<
    UpdateCounterpartBankAccount,
    UpdateCounterpartBankAccountParams,
    CounterpartBankAccountResponse
  >(bankAccountIdPath, (req, res, ctx) => {
    return res(ctx.json(counterpartBankFixture));
  }),

  /**
   * Delete counterpart bank account
   */
  rest.delete<undefined, UpdateCounterpartBankAccountParams, string>(
    bankAccountIdPath,
    (req, res, ctx) => {
      return res(ctx.json(counterpartBankFixture.id));
    }
  ),
];
