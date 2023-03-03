/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';
import type { MoniteAllPaymentMethodsTypes } from './MoniteAllPaymentMethodsTypes';
import type { OptionalFee } from './OptionalFee';
import type { PaidBy } from './PaidBy';
import type { PaymentTypeEnum } from './PaymentTypeEnum';

export type UpdatePaymentFeePayload = {
    region?: string;
    currency?: CurrencyEnum;
    payment_type?: PaymentTypeEnum;
    payment_subtype?: MoniteAllPaymentMethodsTypes;
    partner_fee?: OptionalFee;
    monite_fee?: OptionalFee;
    paid_by?: PaidBy;
};

