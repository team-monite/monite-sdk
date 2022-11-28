/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivablesDiscount } from './ReceivablesDiscount';
import type { ReceivablesReceivablesLineItemProduct } from './ReceivablesReceivablesLineItemProduct';

export type ReceivablesResponseItem = {
    /**
     * The quantity of each of the goods, materials, or services listed in the receivable.
     */
    quantity: number;
    product: ReceivablesReceivablesLineItemProduct;
    /**
     * The discount for a product.
     */
    discount?: ReceivablesDiscount;
};

