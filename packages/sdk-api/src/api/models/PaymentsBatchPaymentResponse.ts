/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { PaymentsBatchPaymentStatus } from './PaymentsBatchPaymentStatus';
import type { SinglePaymentIntentResponse } from './SinglePaymentIntentResponse';

export type PaymentsBatchPaymentResponse = {
  id: string;
  created_at: string;
  error?: Record<string, any>;
  payer_bank_account_id: string;
  payment_intents: Array<SinglePaymentIntentResponse>;
  payment_method: PaymentsBatchPaymentResponse.payment_method;
  status: PaymentsBatchPaymentStatus;
  total_amount?: number;
};

export namespace PaymentsBatchPaymentResponse {
  export enum payment_method {
    US_ACH = 'us_ach',
  }
}
