import { CounterpartBankAccountResponse } from '@team-monite/sdk-api';

const genCounterpartBankFixture = (
  id: number = 0
): CounterpartBankAccountResponse => ({
  counterpart_id: `organization`,
  id: `id-${id}`,
  iban: `iban ${id}`,
  name: `name ${id}`,
  bic: `bic ${id}`,
});

export const counterpartBankFixture: CounterpartBankAccountResponse =
  genCounterpartBankFixture();

export const counterpartBankListFixture: CounterpartBankAccountResponse[] =
  new Array(2).fill('test').map((_, id) => genCounterpartBankFixture(id));
