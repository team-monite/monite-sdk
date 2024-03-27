/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { PaymentIntentPayoutMethod } from './PaymentIntentPayoutMethod';

export type PaymentIntentsRecipient = {
  id: string;
  bank_account_id?: string;
  payout_method?: PaymentIntentPayoutMethod;
  type: PaymentIntentsRecipient.type;
};

export namespace PaymentIntentsRecipient {
  export enum type {
    COUNTERPART = 'counterpart',
  }
}
