/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Price } from './Price';
import type { ProductServiceTypeEnum } from './ProductServiceTypeEnum';

export type ProductServiceUpdate = {
    /**
     * Name of the product.
     */
    name?: string;
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
     * The smallest amount allowed for this product.
     */
    smallest_amount?: number;
    ledger_account_id?: string;
};

