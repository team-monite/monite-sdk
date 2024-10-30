/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { Price } from './Price';
import type { ProductServiceTypeEnum } from './ProductServiceTypeEnum';

export type ProductServiceUpdate = {
  /**
   * Description of the product.
   */
  description?: string;
  ledger_account_id?: string;
  /**
   * The unique ID reference of the unit used to measure the quantity of this product (e.g. items, meters, kilograms).
   */
  measure_unit_id?: string;
  /**
   * Name of the product.
   */
  name?: string;
  price?: Price;
  /**
   * The smallest amount allowed for this product.
   */
  smallest_amount?: number;
  /**
   * Specifies whether this offering is a product or service. This may affect the applicable tax rates.
   */
  type?: ProductServiceTypeEnum;
};
