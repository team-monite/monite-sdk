/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ReceivablePartiallyPaidPayload = {
  /**
   * How much has been paid on the invoice (in minor units).
   */
  amount_paid: number;
  /**
   * Optional comment explaining how the payment was made.
   */
  comment?: string;
};
