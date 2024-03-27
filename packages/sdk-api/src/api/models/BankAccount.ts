/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';
import type { CurrencyEnum } from './CurrencyEnum';

export type BankAccount = {
  id: string;
  account_holder_name?: string;
  account_number?: string;
  bic?: string;
  country?: AllowedCountries;
  currency?: CurrencyEnum;
  display_name?: string;
  iban?: string;
  is_default?: boolean;
  /**
   * Display name of a bank account
   */
  name?: string;
  sort_code?: string;
  was_created_by_user_id?: string;
};
