/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { PaymentObject } from './PaymentObject';

export type PaymentIntent = {
  id: string;
  updated_at: string;
  application_fee_amount?: number;
  object?: PaymentObject;
  provider?: string;
  selected_payment_method?: string;
  status: string;
};
