/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentRequest } from './PaymentRequest';

export type CreatePaymentAuthorisation = {
    institution_id: string;
    callback?: string;
    payment_request: PaymentRequest;
};

