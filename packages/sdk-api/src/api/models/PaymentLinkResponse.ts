/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Object } from './Object';
import type { PayeePayload } from './PayeePayload';
import type { PaymentsPaymentMethodsEnum } from './PaymentsPaymentMethodsEnum';

export type PaymentLinkResponse = {
  /**
   * Amount must convert to at least 50 cents.
   */
  amount: number;
  payment_reference: string;
  currency: string;
  payment_methods: Array<PaymentsPaymentMethodsEnum>;
  cancel_url?: string;
  success_url?: string;
  payee?: PayeePayload;
  object?: Object;
  /**
   * account ID is used as on behalf of account
   */
  account_id: string;
  id: string;
};
