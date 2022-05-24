/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Data that can be updated in existing bank accounts of an entity.
 */
export type UpdateEntityBankAccountRequest = {
  /**
   * The name of the person or business that owns this bank account. If the account currency is GBP or USD, the holder name cannot be changed to an empty string.
   */
  account_holder_name?: string;
  /**
   * User-defined name of this bank account, such as 'Primary account' or 'Savings account'.
   */
  display_name?: string;
};
