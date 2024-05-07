import { delay } from '@/mocks/utils';
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

import { http, HttpResponse } from 'msw';

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
  http.get<
    {},
    CreateCounterpartBankAccountParams,
    CounterpartData<CounterpartBankAccountResponse[]>
  >(bankAccountPath, async () => {
    await delay();

    return HttpResponse.json(
      { data: counterpartBankListFixture },
      {
        status: 201,
      }
    );
  }),

  /**
   * Create counterpart bank account
   */
  http.post<
    CreateCounterpartBankAccountParams,
    CreateCounterpartBankAccount,
    CounterpartBankAccountResponse
  >(bankAccountPath, async ({ request }) => {
    const json = await request.json();

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

    return HttpResponse.json(response);
  }),

  /**
   * Read counterpart bank account
   */
  http.get<UpdateCounterpartBankAccountParams, CounterpartBankAccountResponse>(
    bankAccountIdPath,
    ({ params }) => {
      const { bankAccountId } = params;
      const fixture =
        genCounterpartBankFixture(bankAccountId) || genCounterpartBankFixture();

      return HttpResponse.json(fixture);
    }
  ),

  /**
   * Update counterpart bank account
   */
  http.patch<
    UpdateCounterpartBankAccountParams,
    UpdateCounterpartBankAccount,
    CounterpartBankAccountResponse
  >(bankAccountIdPath, async () => {
    await delay();
    return HttpResponse.json(counterpartBankFixture);
  }),

  /**
   * Delete counterpart bank account
   */
  http.delete<{}, UpdateCounterpartBankAccountParams, string>(
    bankAccountIdPath,
    () => {
      return HttpResponse.json(counterpartBankFixture.id);
    }
  ),
];
