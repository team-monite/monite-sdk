/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { api__schemas__payments__payment_link__Recipient } from './api__schemas__payments__payment_link__Recipient';
import type { PaymentsPaymentLinkStatuses } from './PaymentsPaymentLinkStatuses';
import type { PaymentsPaymentsCurrencyEnum } from './PaymentsPaymentsCurrencyEnum';
import type { PaymentsPaymentsInvoice } from './PaymentsPaymentsInvoice';
import type { PaymentsPaymentsPaymentIntent } from './PaymentsPaymentsPaymentIntent';

export type PaymentsPaymentLinkResponse = {
  id: string;
  currency: PaymentsPaymentsCurrencyEnum;
  status: PaymentsPaymentLinkStatuses;
  recipient: api__schemas__payments__payment_link__Recipient;
  payment_reference?: string;
  amount: number;
  payment_intents: Array<PaymentsPaymentsPaymentIntent>;
  payment_methods: Array<string>;
  total?: number;
  return_url?: string;
  invoice?: PaymentsPaymentsInvoice;
};
