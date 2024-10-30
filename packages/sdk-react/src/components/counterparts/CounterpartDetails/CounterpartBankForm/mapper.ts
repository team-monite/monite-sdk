import { components } from '@monite/sdk-api/src/api';

export type CounterpartBankFields = Omit<
  components['schemas']['CreateCounterpartBankAccount'],
  'country' | 'currency'
> & {
  country: components['schemas']['AllowedCountries'] | '';
  currency: components['schemas']['CurrencyEnum'] | '';
};

export const prepareCounterpartBank = (
  bank: components['schemas']['CreateCounterpartBankAccount'] | undefined
): CounterpartBankFields => {
  return {
    is_default_for_currency: bank?.is_default_for_currency ?? false,
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

export const prepareCreateCounterpartBankAccount = (
  bank: CounterpartBankFields
): components['schemas']['CreateCounterpartBankAccount'] => {
  return {
    is_default_for_currency: bank?.is_default_for_currency,
    bic: bank?.bic,
    iban: bank?.iban,
    account_holder_name: bank?.account_holder_name,
    account_number: bank?.account_number,
    routing_number: bank?.routing_number,
    sort_code: bank?.sort_code,
    name: bank?.name,
    partner_metadata: bank?.partner_metadata,
    country: bank?.country as components['schemas']['AllowedCountries'],
    currency: bank?.currency as components['schemas']['CurrencyEnum'],
  };
};

export const prepareUpdateCounterpartBankAccount = (
  bank: CounterpartBankFields
): components['schemas']['UpdateCounterpartBankAccount'] => {
  return {
    bic: bank?.bic,
    iban: bank?.iban,
    account_holder_name: bank?.account_holder_name,
    account_number: bank?.account_number,
    routing_number: bank?.routing_number,
    sort_code: bank?.sort_code,
    name: bank?.name,
    partner_metadata: bank?.partner_metadata,
    country: bank?.country as components['schemas']['AllowedCountries'],
    currency: bank?.currency as components['schemas']['CurrencyEnum'],
  };
};
