/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';
import type { CurrencyEnum } from './CurrencyEnum';

export type UpdateCounterpartBankAccount = {
  /**
   * The IBAN of the bank account.
   */
  iban?: string;
  /**
   * The BIC/SWIFT code of the bank.
   */
  bic?: string;
  name?: string;
  /**
   * The name of the person or business that owns this bank account. Required for US bank accounts to accept ACH payments.
   */
  account_holder_name?: string;
  /**
   * The bank account number. Required for US bank accounts to accept ACH payments. US account numbers contain 9 to 12 digits. UK account numbers typically contain 8 digits.
   */
  account_number?: string;
  /**
   * The bank's sort code.
   */
  sort_code?: string;
  /**
   * The bank's routing transit number (RTN). Required for US bank accounts to accept ACH payments. US routing numbers consist of 9 digits.
   */
  routing_number?: string;
  currency?: CurrencyEnum;
  country?: AllowedCountries;
  /**
   * Metadata for partner needs.
   */
  partner_metadata?: Record<string, any>;
};
