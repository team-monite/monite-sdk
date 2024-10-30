/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type LineItemResponse = {
  id: string;
  /**
   * ID of the tax rate reference used for accounting integartion. May be used to override auto-picked tax rate reference in accounting platform in case of any platform-specific constraints.
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
  payable_id: string;
  /**
   * The quantity of each of the goods, materials, or services listed in the payable.
   */
  quantity?: number;
  /**
   * The subtotal (excluding VAT), in [minor units](https://docs.monite.com/docs/currencies#minor-units).
   */
  subtotal?: number;
  /**
   * VAT rate in percent [minor units](https://docs.monite.com/docs/currencies#minor-units). Example: 12.5% is 1250.
   */
  tax?: number;
  /**
   * Tax amount in [minor units](https://docs.monite.com/docs/currencies#minor-units). For example, $12.50 is represented as 1250.
   */
  tax_amount?: number;
  /**
   * The actual price of the product.
   */
  total?: number;
  /**
   * The unit of the product
   */
  unit?: string;
  /**
   * The unit price of the product, in [minor units](https://docs.monite.com/docs/currencies#minor-units). For example, $12.50 is represented as 1250.
   */
  unit_price?: number;
  /**
   * ID of the user who created the tag.
   */
  was_created_by_user_id?: string;
};
