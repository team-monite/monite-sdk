/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Payment } from './Payment';

export type CreateBulkPayment = {
    consent: string;
    payments: Array<Payment>;
};

