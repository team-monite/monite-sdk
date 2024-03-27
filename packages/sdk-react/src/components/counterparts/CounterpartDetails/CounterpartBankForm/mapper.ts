import {
  AllowedCountries,
  CreateCounterpartBankAccount,
  CurrencyEnum,
} from '@monite/sdk-api';

export type CounterpartBankFields = Omit<
  CreateCounterpartBankAccount,
  'country' | 'currency'
> & {
  country: AllowedCountries | '';
  currency: CurrencyEnum | '';
};

export const prepareCounterpartBank = (
  bank: CreateCounterpartBankAccount | undefined
): CounterpartBankFields => {
  return {
    account_holder_name: bank?.account_holder_name ?? '',
    account_number: bank?.account_number ?? '',
    country: bank?.country ?? '',
    currency: bank?.currency ?? '',
    routing_number: bank?.routing_number ?? '',
    sort_code: bank?.sort_code ?? '',
    name: bank?.name ?? '',
    bic: bank?.bic ?? '',
    iban: bank?.iban ?? '',
  };
};

export const prepareCounterpartBankSubmit = (
  bank?: CounterpartBankFields
): CreateCounterpartBankAccount => {
  return {
    account_holder_name: bank?.account_holder_name ?? '',
    account_number: bank?.account_number ?? '',
    country: bank?.country as AllowedCountries,
    currency: bank?.currency as CurrencyEnum,
    routing_number: bank?.routing_number ?? '',
    sort_code: bank?.sort_code ?? '',
    name: bank?.name ?? '',
    bic: bank?.bic ?? '',
    iban: bank?.iban ?? '',
  };
};
