/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CurrencyEnum } from './CurrencyEnum';

export type PurchaseOrderItem = {
  /**
   * The currency in which the price of the product is set.
   */
  currency: CurrencyEnum;
  /**
   * The name of the product to purchase
   */
  name: string;
  /**
   * The subtotal cost (excluding VAT), in [minor units](https://docs.monite.com/docs/currencies#minor-units).
   */
  price: number;
  /**
   * Number (quantity) of products
   */
  quantity: number;
  /**
   * Units (hours, meters, unit)
   */
  unit: string;
  /**
   * Percent minor units. Example: 12.5% is 1250
   */
  vat_rate: number;
};
