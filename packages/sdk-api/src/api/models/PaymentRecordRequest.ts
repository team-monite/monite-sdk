/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CurrencyEnum } from './CurrencyEnum';
import type { PaymentRecordObjectRequest } from './PaymentRecordObjectRequest';

export type PaymentRecordRequest = {
  amount: number;
  currency: CurrencyEnum;
  entity_user_id?: string;
  object: PaymentRecordObjectRequest;
  paid_at: string;
  payment_intent_id: string;
};
