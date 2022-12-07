/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivablesCurrencyEnum } from './ReceivablesCurrencyEnum';

export type ReceivablesPrice = {
    /**
     * The currency in which the price of the product is set.
     */
    currency: ReceivablesCurrencyEnum;
    /**
     * The actual price of the product.
     */
    value: number;
};

