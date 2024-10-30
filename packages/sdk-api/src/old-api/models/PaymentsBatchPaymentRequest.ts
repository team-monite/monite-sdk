/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { SinglePaymentIntent } from './SinglePaymentIntent';

export type PaymentsBatchPaymentRequest = {
  payer_bank_account_id: string;
  payment_intents: Array<SinglePaymentIntent>;
  payment_method: PaymentsBatchPaymentRequest.payment_method;
};

export namespace PaymentsBatchPaymentRequest {
  export enum payment_method {
    US_ACH = 'us_ach',
  }
}
