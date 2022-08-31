/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';
import type { PayeeInfo } from './PayeeInfo';

export type PaymentDetailsResponse = {
    id: string;
    /**
     * currency amount in minor units
     */
    amount: number;
    currency: CurrencyEnum;
    status: string;
    reference?: string;
    payee?: PayeeInfo;
};

