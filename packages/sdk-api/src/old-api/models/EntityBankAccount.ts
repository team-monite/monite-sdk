/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';
import type { CurrencyEnum } from './CurrencyEnum';

export type EntityBankAccount = {
  /**
   * Unique ID of the entity bank account.
   */
  id?: string;
  /**
   * Account holder's name
   */
  account_holder_name?: string;
  /**
   * Account number (required if IBAN is not provided)
   */
  account_number?: string;
  /**
   * The name of the entity's bank account.
   */
  bank_name?: string;
  /**
   * The BIC of the entity's bank account.
   */
  bic?: string;
  country?: AllowedCountries;
  currency?: CurrencyEnum;
  display_name?: string;
  /**
   * The IBAN of the entity's bank account.
   */
  iban?: string;
  /**
   * Marks if a bank account should be used by default. Only 1 can be True
   */
  is_default?: boolean;
  /**
   * Routing number (US)
   */
  routing_number?: string;
  /**
   * Sort code (GB)
   */
  sort_code?: string;
  was_created_by_user_id?: string;
};
