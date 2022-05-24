/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LineItemProduct } from './LineItemProduct';

export type ResponseItem = {
    /**
     * The quantity of each of the goods, materials, or services listed in the receivable.
     */
    quantity: number;
    product: LineItemProduct;
};
