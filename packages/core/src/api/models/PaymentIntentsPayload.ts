/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Object } from './Object';
import type { PaymentMethodsEnum } from './PaymentMethodsEnum';

export type PaymentIntentsPayload = {
    /**
     * Amount must convert to at least 50 cents.
     */
    amount: number;
    currency: string;
    payment_method_type: PaymentMethodsEnum;
    object?: Object;
};

