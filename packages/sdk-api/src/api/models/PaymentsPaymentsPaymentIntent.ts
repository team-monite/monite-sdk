/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentsStripe } from './PaymentsStripe';

export type PaymentsPaymentsPaymentIntent = {
  id: string;
  was_used_for_payment?: boolean;
  application_fee_amount?: number;
  payment_method: string;
  key: PaymentsStripe;
  provider: string;
};
