/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ReceivablePartiallyPaidPayload = {
    /**
     * How much is left to be paid on the invoice (in minor units).
     */
    amount_due: number;
    /**
     * Optional comment explaining how the payment was made.
     */
    comment?: string;
};

