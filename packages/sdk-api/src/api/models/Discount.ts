/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DiscountType } from './DiscountType';

export type Discount = {
    /**
     * The field specifies whether to use product currency or %.
     */
    type: DiscountType;
    /**
     * The actual discount of the product in units.
     */
    amount: number;
};

