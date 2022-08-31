/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Amount } from './Amount';
import type { Payee } from './Payee';
import type { PaymentAuthorisationTypes } from './PaymentAuthorisationTypes';

export type Payment = {
    type?: PaymentAuthorisationTypes;
    /**
     * The payment reference or description. Limited to a maximum of 18 characters long.
     */
    reference?: string;
    payment_idempotency_id: string;
    amount: Amount;
    payee: Payee;
};

