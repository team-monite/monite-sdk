/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AccountResponse } from './AccountResponse';
import type { CurrencyEnum } from './CurrencyEnum';
import type { Invoice } from './Invoice';
import type { PaymentIntent } from './PaymentIntent';
import type { RecipientAccountResponse } from './RecipientAccountResponse';

export type PublicPaymentLinkResponse = {
  id: string;
  amount: number;
  currency: CurrencyEnum;
  expires_at: string;
  invoice?: Invoice;
  payer?: AccountResponse;
  payment_intent?: PaymentIntent;
  payment_intent_id: string;
  payment_methods: Array<string>;
  payment_page_url: string;
  payment_reference?: string;
  recipient: RecipientAccountResponse;
  return_url?: string;
  status: string;
};
