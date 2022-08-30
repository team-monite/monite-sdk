/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';

export type FeeResponse = {
    id: string;
    region: string;
    currency: CurrencyEnum;
    payment_type: string;
    payment_subtype: string;
    partner_fee_percentage: number;
    partner_fee_percentage_limit: number;
    partner_fee_amount: number;
    monite_fee_percentage: number;
    monite_fee_percentage_limit: number;
    monite_fee_amount: number;
    created_at: string;
};

