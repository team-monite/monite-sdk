/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { PaymentIntentWithSecrets } from './PaymentIntentWithSecrets';

export type InternalPaymentLinkResponse = {
  id: string;
  confirm_on_backend?: boolean;
  entity_id: string;
  expires_at: string;
  partner_id: string;
  payment_intent: PaymentIntentWithSecrets;
  payment_intent_id: string;
  payment_page_url: string;
  project_id: string;
  return_url?: string;
  status: string;
};
