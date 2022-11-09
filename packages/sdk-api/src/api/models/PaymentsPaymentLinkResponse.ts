/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentsPaymentsAccountResponse } from './PaymentsPaymentsAccountResponse';
import type { PaymentsPaymentsCurrencyEnum } from './PaymentsPaymentsCurrencyEnum';
import type { PaymentsPaymentsInvoice } from './PaymentsPaymentsInvoice';
import type { PaymentsPaymentsPaymentIntent } from './PaymentsPaymentsPaymentIntent';
import type { PaymentsRecipientPaymentsPaymentsAccountResponse } from './PaymentsRecipientPaymentsPaymentsAccountResponse';

export type PaymentsPaymentLinkResponse = {
  payer?: PaymentsPaymentsAccountResponse;
  recipient: PaymentsRecipientPaymentsPaymentsAccountResponse;
  id: string;
  currency: PaymentsPaymentsCurrencyEnum;
  status: string;
  payment_reference?: string;
  amount: number;
  payment_intents: Array<PaymentsPaymentsPaymentIntent>;
  payment_methods: Array<string>;
  total?: number;
  return_url?: string;
  invoice?: PaymentsPaymentsInvoice;
  expires_at: string;
};
