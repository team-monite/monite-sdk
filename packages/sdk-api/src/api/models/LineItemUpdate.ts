/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Discount } from './Discount';

export type LineItemUpdate = {
    /**
     * The actual price of the product in [minor units](https://docs.monite.com/docs/currencies#minor-units).
     */
    price?: number;
    /**
     * The quantity of each of the goods, materials, or services listed in the receivable.
     */
    quantity?: number;
    /**
     * Percent minor units. Example: 12.5% is 1250
     */
    vat: number;
    /**
     * The discount for a product.
     */
    discount?: Discount;
};

