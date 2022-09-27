import { CounterpartBankAccount } from '@monite/sdk-api';

export type CounterpartBankFields = Required<CounterpartBankAccount>;

export const prepareCounterpartBank = (
  bank?: CounterpartBankAccount
): CounterpartBankFields => {
  return {
    name: bank?.name ?? '',
    bic: bank?.bic ?? '',
    iban: bank?.iban ?? '',
  };
};
