/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentProvider } from './PaymentProvider';

export type PaymentIntentsResponse = {
    providers: Array<PaymentProvider>;
    monite_page_url: string;
    application_fee_amount: number;
};

