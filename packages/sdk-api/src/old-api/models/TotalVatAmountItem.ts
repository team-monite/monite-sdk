/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TotalVatAmountItem = {
  id: string;
  /**
   * The total VAT of all line items, in [minor units](https://docs.monite.com/docs/currencies#minor-units).
   */
  amount: number;
  /**
   * Percent minor units. Example: 12.5% is 1250.
   */
  value: number;
};
