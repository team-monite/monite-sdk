/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaidBy } from './PaidBy';
import type { Total } from './Total';

export type PaymentMethodsCalculateFeeResponse = {
    paid_by: PaidBy;
    total: Total;
};

