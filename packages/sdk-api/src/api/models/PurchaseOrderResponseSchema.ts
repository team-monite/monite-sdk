/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartResponse } from './CounterpartResponse';
import type { CurrencyEnum } from './CurrencyEnum';
import type { EntityIndividualResponse } from './EntityIndividualResponse';
import type { EntityOrganizationResponse } from './EntityOrganizationResponse';
import type { PurchaseOrderItem } from './PurchaseOrderItem';

/**
 * Represents response for an Accounts Purchase Order document created by entity.
 */
export type PurchaseOrderResponseSchema = {
    /**
     * Counterpart unique ID.
     */
    counterpart_id: string;
    /**
     * Number of days for which purchase order is valid
     */
    valid_for_days: number;
    /**
     * List of item to purchase
     */
    items: Array<PurchaseOrderItem>;
    /**
     * Msg which will be send to counterpart for who the purchase order is issued.
     */
    message: string;
    /**
     * The currency in which the price of the product is set. (all items need to have the same currency)
     */
    currency: CurrencyEnum;
    /**
     * A unique ID assigned to this purchase order.
     */
    id: string;
    /**
     * Time at which the receivable was created. Timestamps follow the ISO 8601 standard.
     */
    created_at: string;
    /**
     * Time at which the receivable was last updated. Timestamps follow the ISO 8601 standard.
     */
    updated_at: string;
    /**
     * Counterpart information about an organization (juridical person) or individual (natural person) that provides goods and services to or buys them from an
     */
    counterpart: CounterpartResponse;
    /**
     * When status changed from 'draft' to 'send', so after sending purchase order
     */
    issued_at?: string;
    /**
     * The ID of the entity which issued the purchase order.
     */
    entity_id: string;
    /**
     * Data of the entity (address, name, contact)
     */
    entity: (EntityIndividualResponse | EntityOrganizationResponse);
    /**
     * ID of the creator of the purchase order
     */
    created_by_user_id?: string;
    /**
     * Purchase order can be in 'draft' state before sending it to counterpart. After that state is 'issued'
     */
    status: string;
    document_id: string;
    file_url?: string;
    file_id?: string;
};

