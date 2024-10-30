/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CurrencyEnum } from './CurrencyEnum';
import type { PaymentIntentsRecipient } from './PaymentIntentsRecipient';
import type { PaymentObjectPayable } from './PaymentObjectPayable';

export type SinglePaymentIntentResponse = {
  id: string;
  created_at: string;
  amount: number;
  currency: CurrencyEnum;
  error?: Record<string, any>;
  object: PaymentObjectPayable;
  payment_reference: string;
  recipient: PaymentIntentsRecipient;
  status: string;
};
