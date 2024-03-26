/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PaymentTermDiscountWithDate = {
  /**
   * The discount percentage in minor units. E.g., 200 means 2%. 1050 means 10.5%.
   */
  discount: number;
  end_date?: string;
  /**
   * The amount of days after the invoice issue date.
   */
  number_of_days: number;
};
