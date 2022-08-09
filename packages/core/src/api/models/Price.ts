/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';

export type Price = {
    /**
     * The currency in which the price of the product is set.
     */
    currency: CurrencyEnum;
    /**
     * The actual price of the product.
     */
    value: number;
};

