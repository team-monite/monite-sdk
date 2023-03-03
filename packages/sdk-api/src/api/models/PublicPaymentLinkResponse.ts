/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccountResponse } from './AccountResponse';
import type { CurrencyEnum } from './CurrencyEnum';
import type { Invoice } from './Invoice';
import type { PaymentIntent } from './PaymentIntent';
import type { RecipientAccountResponse } from './RecipientAccountResponse';

export type PublicPaymentLinkResponse = {
    payer?: AccountResponse;
    recipient: RecipientAccountResponse;
    id: string;
    currency: CurrencyEnum;
    status: string;
    payment_reference?: string;
    amount: number;
    payment_methods: Array<string>;
    return_url?: string;
    invoice?: Invoice;
    expires_at: string;
    payment_page_url: string;
    payment_intent?: PaymentIntent;
};

