/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CounterpartRawBankAccount = {
  /**
   * Vendor's bank account number, IBAN, or similar (if specified in the payable document).
   */
  account_number?: string;
  /**
   * SWIFT code (BIC) of the vendor's bank.
   */
  bic?: string;
  /**
   * required for non-GB bank accounts
   */
  iban?: string;
  /**
   * required for GB bank accounts
   */
  sort_code?: string;
};
