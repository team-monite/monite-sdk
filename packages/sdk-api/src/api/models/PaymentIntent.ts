/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PaymentIntent = {
  id: string;
  status: string;
  application_fee_amount?: number;
  selected_payment_method?: string;
  provider?: string;
};
