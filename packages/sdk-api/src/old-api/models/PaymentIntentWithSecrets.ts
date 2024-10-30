/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AccountResponse } from './AccountResponse';
import type { Invoice } from './Invoice';
import type { MoniteAllPaymentMethodsTypes } from './MoniteAllPaymentMethodsTypes';
import type { PaymentObject } from './PaymentObject';
import type { RecipientAccountResponse } from './RecipientAccountResponse';
import type { Stripe } from './Stripe';

export type PaymentIntentWithSecrets = {
  id: string;
  updated_at: string;
  amount: number;
  application_fee_amount?: number;
  batch_payment_id?: string;
  confirm_on_backend?: boolean;
  currency: string;
  invoice?: Invoice;
  key?: Stripe;
  object?: PaymentObject;
  payer?: AccountResponse;
  payment_link_id?: string;
  payment_methods: Array<MoniteAllPaymentMethodsTypes>;
  payment_reference?: string;
  provider?: string;
  recipient: RecipientAccountResponse;
  selected_payment_method?: MoniteAllPaymentMethodsTypes;
  status: string;
};
