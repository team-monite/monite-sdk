/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';
import type { CurrencyEnum } from './CurrencyEnum';

/**
 * Represents a bank account owned by an entity.
 */
export type EntityBankAccountResponse = {
  /**
   * Unique ID of the bank account.
   */
  id: string;
  /**
   * The name of the person or business that owns this bank account. Required if the account currency is GBP or USD.
   */
  account_holder_name?: string;
  /**
   * The bank account number. Required if the account currency is GBP or USD. UK account numbers typically contain 8 digits. US bank account numbers contain 9 to 12 digits.
   */
  account_number?: string;
  /**
   * The bank name.
   */
  bank_name?: string;
  /**
   * The SWIFT/BIC code of the bank.
   */
  bic?: string;
  /**
   * The country in which the bank account is registered, repsesented as a two-letter country code ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)).
   */
  country?: AllowedCountries;
  /**
   * The currency of the bank account, represented as a three-letter ISO [currency code](https://docs.monite.com/docs/currencies).
   */
  currency?: CurrencyEnum;
  /**
   * User-defined name of this bank account, such as 'Primary account' or 'Savings account'.
   */
  display_name?: string;
  /**
   * The IBAN of the bank account. Required if the account currency is EUR.
   */
  iban?: string;
  /**
   * Indicates whether this bank account is the default one for its currency.
   */
  is_default_for_currency?: boolean;
  /**
   * The bank's routing transit number (RTN). Required if the account currency is USD. US routing numbers consist of 9 digits.
   */
  routing_number?: string;
  /**
   * The bank's sort code. Required if the account currency is GBP.
   */
  sort_code?: string;
  /**
   * ID of the entity user who added this bank account, or `null` if it was added using a partner access token.
   */
  was_created_by_user_id?: string;
};
