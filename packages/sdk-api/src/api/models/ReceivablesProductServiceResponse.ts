/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivablesPrice } from './ReceivablesPrice';
import type { ReceivablesProductServiceTypeEnum } from './ReceivablesProductServiceTypeEnum';

export type ReceivablesProductServiceResponse = {
    /**
     * Name of the product.
     */
    name: string;
    /**
     * Specifies whether this offering is a product or service. This may affect the applicable tax rates.
     */
    type?: ReceivablesProductServiceTypeEnum;
    /**
     * Description of the product.
     */
    description?: string;
    price?: ReceivablesPrice;
    /**
     * The unique ID reference of the unit used to measure the quantity of this product (e.g. items, meters, kilograms).
     */
    measure_unit_id: string;
    /**
     * The smallest amount allowed for this product.
     */
    smallest_amount?: number;
    ledger_account_id?: string;
    /**
     * Unique ID of the product.
     */
    id?: string;
    entity_id: string;
    entity_user_id?: string;
    /**
     * Time at which the product was created. Timestamps follow the ISO 8601 standard.
     */
    created_at: string;
    /**
     * Time at which the product was last updated. Timestamps follow the ISO 8601 standard.
     */
    updated_at: string;
};

