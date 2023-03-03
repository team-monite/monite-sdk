/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccountResponse } from './AccountResponse';
import type { Invoice } from './Invoice';
import type { MoniteAllPaymentMethodsTypes } from './MoniteAllPaymentMethodsTypes';
import type { RecipientAccountResponse } from './RecipientAccountResponse';

export type PaymentIntentResponse = {
    payer?: AccountResponse;
    recipient: RecipientAccountResponse;
    id: string;
    status: string;
    amount: number;
    payment_methods: Array<MoniteAllPaymentMethodsTypes>;
    selected_payment_method?: MoniteAllPaymentMethodsTypes;
    payment_link_id: string;
    currency: string;
    payment_reference?: string;
    provider?: string;
    application_fee_amount?: number;
    invoice?: Invoice;
};

