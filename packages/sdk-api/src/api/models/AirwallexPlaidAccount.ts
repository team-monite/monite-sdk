/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AirwallexPlaidAccount = {
  /**
   * Plaid`s unique identifier for the account
   */
  id: string;
  /**
   * The last 2-4 alphanumeric characters of an account's official account number
   */
  mask: string;
  /**
   * The name of the account, either assigned by the user or by the financial institution itself
   */
  name: string;
};
