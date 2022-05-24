/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { PaymentIntentsRecipient } from './PaymentIntentsRecipient';
import type { PaymentObjectPayable } from './PaymentObjectPayable';

export type SinglePaymentIntent = {
  object: PaymentObjectPayable;
  /**
   * Must be provided if payable's document id is missing.
   */
  payment_reference?: string;
  recipient: PaymentIntentsRecipient;
};
