/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { DiscountType } from './DiscountType';

export type Discount = {
  /**
   * The actual discount of the product in [minor units](https://docs.monite.com/docs/currencies#minor-units) if type field equals amount, else in percent minor units
   */
  amount: number;
  /**
   * The field specifies whether to use product currency or %.
   */
  type: DiscountType;
};
