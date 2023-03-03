/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Price } from './Price';
import type { ProductServiceTypeEnum } from './ProductServiceTypeEnum';

export type ProductServiceRequest = {
    /**
     * Name of the product.
     */
    name: string;
    /**
     * Specifies whether this offering is a product or service. This may affect the applicable tax rates.
     */
    type?: ProductServiceTypeEnum;
    /**
     * Description of the product.
     */
    description?: string;
    price?: Price;
    /**
     * The unique ID reference of the unit used to measure the quantity of this product (e.g. items, meters, kilograms).
     */
    measure_unit_id: string;
    /**
     * The smallest amount allowed for this product.
     */
    smallest_amount?: number;
    ledger_account_id?: string;
};

