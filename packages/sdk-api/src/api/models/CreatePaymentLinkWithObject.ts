/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MoniteAllPaymentMethodsTypes } from './MoniteAllPaymentMethodsTypes';
import type { PaymentAccountObject } from './PaymentAccountObject';
import type { PaymentObject } from './PaymentObject';

export type CreatePaymentLinkWithObject = {
    recipient: PaymentAccountObject;
    return_url?: string;
    expires_at?: string;
    payment_methods: Array<MoniteAllPaymentMethodsTypes>;
    object: PaymentObject;
};

