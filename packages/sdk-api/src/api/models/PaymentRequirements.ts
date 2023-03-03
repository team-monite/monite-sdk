/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PaymentRequirements = {
    currently_due: Array<string>;
    eventually_due: Array<string>;
    current_deadline?: string;
    pending_verification: Array<string>;
};

