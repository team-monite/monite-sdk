/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';

export type api__schemas__accounts_receivables__billables__Price = {
    /**
     * The currency in which the price of the product is set.
     */
    currency: CurrencyEnum;
    /**
     * The actual price of the product.
     */
    value: number;
};
