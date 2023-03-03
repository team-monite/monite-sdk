/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';
import type { Fee } from './Fee';
import type { MoniteAllPaymentMethodsTypes } from './MoniteAllPaymentMethodsTypes';
import type { PaidBy } from './PaidBy';
import type { PaymentTypeEnum } from './PaymentTypeEnum';

export type CreatePaymentFeePayload = {
    region: string;
    currency: CurrencyEnum;
    payment_type: PaymentTypeEnum;
    payment_subtype: MoniteAllPaymentMethodsTypes;
    partner_fee: Fee;
    monite_fee: Fee;
    paid_by?: PaidBy;
};

