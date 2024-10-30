/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { Discount } from './Discount';

export type LineItem = {
  /**
   * The discount for a product.
   */
  discount?: Discount;
  product_id: string;
  /**
   * The quantity of each of the goods, materials, or services listed in the receivable.
   */
  quantity: number;
  vat_rate_id: string;
};
