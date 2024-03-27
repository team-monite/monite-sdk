/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AccountResponse } from './AccountResponse';
import type { Invoice } from './Invoice';
import type { MoniteAllPaymentMethodsTypes } from './MoniteAllPaymentMethodsTypes';
import type { PaymentObject } from './PaymentObject';
import type { RecipientAccountResponse } from './RecipientAccountResponse';

export type PaymentIntentResponse = {
  id: string;
  updated_at: string;
  amount: number;
  application_fee_amount?: number;
  batch_payment_id?: string;
  currency: string;
  invoice?: Invoice;
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
