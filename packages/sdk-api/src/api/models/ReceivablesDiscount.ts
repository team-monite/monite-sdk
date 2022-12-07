/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivablesReceivablesDiscountType } from './ReceivablesReceivablesDiscountType';

export type ReceivablesDiscount = {
    /**
     * The field specifies whether to use product currency or %.
     */
    type: ReceivablesReceivablesDiscountType;
    /**
     * The actual discount of the product in units.
     */
    amount: number;
};

