/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type LineItemRequest = {
  /**
   * ID of the tax rate reference used for accounting integration. May be used to override auto-picked tax rate reference in accounting platform in case of any platform-specific constraints.
   */
  accounting_tax_rate_id?: string;
  /**
   * Description of the product.
   */
  description?: string;
  /**
   * ID of the account record used to store bookkeeping entries for balance-sheet and income-statement transactions.
   */
  ledger_account_id?: string;
  /**
   * Name of the product.
   */
  name?: string;
  /**
   * The quantity of each of the goods, materials, or services listed in the payable.
   */
  quantity?: number;
  /**
   * VAT rate in percent [minor units](https://docs.monite.com/docs/currencies#minor-units). Example: 12.5% is 1250.
   */
  tax?: number;
  /**
   * The unit of the product
   */
  unit?: string;
  /**
   * The unit price of the product, in [minor units](https://docs.monite.com/docs/currencies#minor-units). For example, $12.50 is represented as 1250.
   */
  unit_price?: number;
};
