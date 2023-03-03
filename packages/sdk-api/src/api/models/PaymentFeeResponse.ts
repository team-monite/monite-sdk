/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';
import type { Fee } from './Fee';

export type PaymentFeeResponse = {
    id: string;
    region: string;
    currency: CurrencyEnum;
    payment_type: string;
    payment_subtype: string;
    partner_fee: Fee;
    monite_fee: Fee;
    created_at: string;
    updated_at: string;
    paid_by: string;
};

