/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';
import type { PaymentMethodsEnum } from './PaymentMethodsEnum';
import type { PaymentTypeEnum } from './PaymentTypeEnum';

export type UpdateFeePayload = {
    region?: string;
    currency?: CurrencyEnum;
    payment_type?: PaymentTypeEnum;
    payment_subtype?: PaymentMethodsEnum;
    partner_fee_percentage?: number;
    partner_fee_amount?: number;
    monite_fee_percentage?: number;
    monite_fee_amount?: number;
    partner_fee_percentage_limit?: number;
    monite_fee_percentage_limit?: number;
};

