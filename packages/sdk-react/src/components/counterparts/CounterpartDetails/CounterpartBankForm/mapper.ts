import { components } from '@/api';

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
    is_default: bank?.is_default ?? false,
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
  bank: CounterpartBankFields
): components['schemas']['CreateCounterpartBankAccount'] => {
  return {
    ...bank,
    is_default: bank?.is_default ?? false,
    country: bank?.country as components['schemas']['AllowedCountries'],
    currency: bank?.currency as components['schemas']['CurrencyEnum'],
  };
};
