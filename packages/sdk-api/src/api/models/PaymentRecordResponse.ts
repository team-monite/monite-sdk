/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CurrencyEnum } from './CurrencyEnum';
import type { PaymentRecordObjectResponse } from './PaymentRecordObjectResponse';

export type PaymentRecordResponse = {
  id: string;
  amount: number;
  currency: CurrencyEnum;
  entity_user_id?: string;
  is_external: boolean;
  object: PaymentRecordObjectResponse;
  /**
   * Filled in a case, if payment amount is more, than total_amount
   */
  overpaid_amount?: number;
  paid_at: string;
  payment_intent_id: string;
};
