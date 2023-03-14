/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Discount } from './Discount';
import type { LineItemProduct } from './LineItemProduct';

export type ResponseItem = {
    /**
     * The quantity of each of the goods, materials, or services listed in the receivable.
     */
    quantity: number;
    product: LineItemProduct;
    /**
     * The discount for a product.
     */
    discount?: Discount;
    /**
     * Total of line_item before VAT in [minor units](https://docs.monite.com/docs/currencies#minor-units).
     */
    total_before_tax?: number;
};

