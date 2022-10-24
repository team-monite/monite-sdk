/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentsPaymentLinkStatuses } from './PaymentsPaymentLinkStatuses';
import type { PaymentsPaymentsAccountResponse } from './PaymentsPaymentsAccountResponse';
import type { PaymentsPaymentsCurrencyEnum } from './PaymentsPaymentsCurrencyEnum';
import type { PaymentsPaymentsInvoice } from './PaymentsPaymentsInvoice';
import type { PaymentsPaymentsPaymentIntent } from './PaymentsPaymentsPaymentIntent';

export type PaymentsPaymentLinkResponse = {
  payer?: PaymentsPaymentsAccountResponse;
  recipient: PaymentsPaymentsAccountResponse;
  id: string;
  currency: PaymentsPaymentsCurrencyEnum;
  status: PaymentsPaymentLinkStatuses;
  payment_reference?: string;
  amount: number;
  payment_intents: Array<PaymentsPaymentsPaymentIntent>;
  payment_methods: Array<string>;
  total?: number;
  return_url?: string;
  invoice?: PaymentsPaymentsInvoice;
};
