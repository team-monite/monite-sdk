/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentIntentWithSecrets } from './PaymentIntentWithSecrets';

export type InternalPaymentLinkResponse = {
    id: string;
    status: string;
    return_url?: string;
    expires_at: string;
    payment_page_url: string;
    payment_intent: PaymentIntentWithSecrets;
};

