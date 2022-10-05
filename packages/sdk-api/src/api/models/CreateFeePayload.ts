/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';
import type { PaymentsPaymentMethodsEnum } from './PaymentsPaymentMethodsEnum';
import type { PaymentTypeEnum } from './PaymentTypeEnum';

export type CreateFeePayload = {
  region: string;
  currency: CurrencyEnum;
  payment_type: PaymentTypeEnum;
  payment_subtype: PaymentsPaymentMethodsEnum;
  partner_fee_percentage: number;
  partner_fee_amount: number;
  monite_fee_percentage: number;
  monite_fee_amount: number;
  partner_fee_percentage_limit?: number;
  monite_fee_percentage_limit?: number;
};
