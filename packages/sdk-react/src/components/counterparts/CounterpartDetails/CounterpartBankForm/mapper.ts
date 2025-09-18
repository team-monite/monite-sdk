import { type CounterpartBankFormFields } from './validation';
import { components } from '@/api';

/**
 * Prepares the bank object from the API response for use in the form by normalizing its fields.
 */
export const prepareCounterpartBank = (
  bank: components['schemas']['CreateCounterpartBankAccount'] | undefined
): CounterpartBankFormFields => {
  return {
    is_default_for_currency: bank?.is_default_for_currency ?? false,
    account_holder_name: bank?.account_holder_name ?? '',
    account_number: bank?.account_number ?? '',
    country: bank?.country ?? '',
    currency: (bank?.currency ?? '') as components['schemas']['CurrencyEnum'],
    routing_number: bank?.routing_number ?? '',
    sort_code: bank?.sort_code ?? '',
    name: bank?.name ?? '',
    bic: bank?.bic ?? '',
    iban: bank?.iban ?? '',
  };
};

/**
 * Prepares the bank object for creation by converting the form fields to the API format.
 */
export const prepareCreateCounterpartBankAccount = (
  bank: CounterpartBankFormFields
): components['schemas']['CreateCounterpartBankAccount'] => {
  return {
    is_default_for_currency: bank?.is_default_for_currency ?? false,
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

/**
 * Prepares the bank object for update by converting the form fields to the API format.
 */
export const prepareUpdateCounterpartBankAccount = (
  bank: CounterpartBankFormFields
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
