/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Amount } from './Amount';
import type { Payee } from './Payee';
import type { PaymentAuthorisationTypes } from './PaymentAuthorisationTypes';

/**
 * The payment request object defining the details of the payment.
 */
export type PaymentRequest = {
    payment_idempotency_id: string;
    /**
     * The payment reference or description. Limited to a maximum of 18 characters long.
     */
    reference?: string;
    type?: PaymentAuthorisationTypes;
    payee: Payee;
    amount: Amount;
};

