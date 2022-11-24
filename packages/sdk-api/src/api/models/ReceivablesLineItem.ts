/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivablesDiscount } from './ReceivablesDiscount';

export type ReceivablesLineItem = {
    /**
     * The quantity of each of the goods, materials, or services listed in the receivable.
     */
    quantity: number;
    product_id: string;
    vat_rate_id: string;
    /**
     * The discount for a product.
     */
    discount?: ReceivablesDiscount;
};

