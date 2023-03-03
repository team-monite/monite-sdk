/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';
import type { Invoice } from './Invoice';
import type { MoniteAllPaymentMethodsTypes } from './MoniteAllPaymentMethodsTypes';
import type { PaymentAccountObject } from './PaymentAccountObject';

export type CreatePaymentLinkWithoutObject = {
    recipient: PaymentAccountObject;
    return_url?: string;
    expires_at?: string;
    payment_methods: Array<MoniteAllPaymentMethodsTypes>;
    amount: number;
    currency: CurrencyEnum;
    payment_reference: string;
    invoice?: Invoice;
};

