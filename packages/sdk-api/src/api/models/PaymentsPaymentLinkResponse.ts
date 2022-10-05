/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { api__v1__payment_links__schemas__Recipient } from './api__v1__payment_links__schemas__Recipient';
import type { PaymentsPaymentLinkStatuses } from './PaymentsPaymentLinkStatuses';
import type { PaymentsPaymentsCurrencyEnum } from './PaymentsPaymentsCurrencyEnum';
import type { PaymentsPaymentsPaymentIntent } from './PaymentsPaymentsPaymentIntent';

export type PaymentsPaymentLinkResponse = {
  id: string;
  currency: PaymentsPaymentsCurrencyEnum;
  status: PaymentsPaymentLinkStatuses;
  recipient: api__v1__payment_links__schemas__Recipient;
  payment_reference?: string;
  amount: number;
  payment_intents: Array<PaymentsPaymentsPaymentIntent>;
  payment_methods: Array<string>;
  total?: number;
  return_url?: string;
};
