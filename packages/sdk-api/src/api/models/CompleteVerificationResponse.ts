/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';
import type { BankAccountVerifications } from './BankAccountVerifications';
import type { CurrencyEnum } from './CurrencyEnum';

export type CompleteVerificationResponse = {
  /**
   * Deprecated. Use bank_account_id instead.
   * @deprecated
   */
  id: string;
  /**
   * Account holder's name
   */
  account_holder_name?: string;
  /**
   * Account number (required if IBAN is not provided)
   */
  account_number?: string;
  bank_account_id: string;
  /**
   * The name of the entity`s bank account.
   */
  bank_name?: string;
  /**
   * The BIC of the entity`s bank account.
   */
  bic?: string;
  country?: AllowedCountries;
  currency?: CurrencyEnum;
  display_name?: string;
  /**
   * The IBAN of the entity`s bank account.
   */
  iban?: string;
  /**
   * Marks if a bank account should be used by default for the currency. Only 1 can be True for each currency.
   */
  is_default: boolean;
  /**
   * Routing number (US)
   */
  routing_number?: string;
  /**
   * Sort code (GB)
   */
  sort_code?: string;
  verifications: BankAccountVerifications;
  was_created_by_user_id?: string;
};
