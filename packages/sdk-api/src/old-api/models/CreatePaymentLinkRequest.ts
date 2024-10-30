/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CurrencyEnum } from './CurrencyEnum';
import type { Invoice } from './Invoice';
import type { MoniteAllPaymentMethodsTypes } from './MoniteAllPaymentMethodsTypes';
import type { PaymentAccountObject } from './PaymentAccountObject';
import type { PaymentObject } from './PaymentObject';

export type CreatePaymentLinkRequest = {
  /**
   * The payment amount in [minor units](https://docs.monite.com/docs/currencies#minor-units). Required if `object` is not specified.
   */
  amount?: number;
  /**
   * The payment currency. Required if `object` is not specified.
   */
  currency?: CurrencyEnum;
  expires_at?: string;
  /**
   * An object containing information about the invoice being paid. Used only if `object` is not specified.
   */
  invoice?: Invoice;
  /**
   * If the invoice being paid is a payable or receivable stored in Monite, provide the `object` object containing the invoice type and ID. Otherwise, use the `amount`, `currency`, `payment_reference`, and (optionally) `invoice` fields to specify the invoice-related data.
   */
  object?: PaymentObject;
  payment_methods: Array<MoniteAllPaymentMethodsTypes>;
  /**
   * A payment reference number that the recipient can use to identify the payer or purpose of the transaction. Required if `object` is not specified.
   */
  payment_reference?: string;
  recipient: PaymentAccountObject;
  return_url?: string;
};
