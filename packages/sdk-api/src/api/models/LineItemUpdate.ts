/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { Discount } from './Discount';

export type LineItemUpdate = {
  /**
   * The discount for a product.
   */
  discount?: Discount;
  /**
   * The actual price of the product in [minor units](https://docs.monite.com/docs/currencies#minor-units).
   */
  price?: number;
  /**
   * The quantity of each of the goods, materials, or services listed in the receivable.
   */
  quantity?: number;
  /**
   * Vat rate object id
   */
  vat_rate_id?: string;
};
