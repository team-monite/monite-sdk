/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityAddressSchema } from './EntityAddressSchema';
import type { EntityIndividual } from './EntityIndividual';
import type { EntityOrganization } from './EntityOrganization';

export type UpdateIssuedInvoice = {
    /**
     * A note with additional information for a receivable
     */
    memo?: string;
    entity_address?: EntityAddressSchema;
    entity?: (EntityOrganization | EntityIndividual);
    /**
     * Id of a new or updated counterpart
     */
    counterpart_id?: string;
    /**
     * Unique ID of the counterpart contact.
     */
    contact_id?: string;
    /**
     * The date when the goods are shipped or the service is provided.
     *
     * If omitted, defaults to the invoice issue date,
     * and the value is automatically set when the invoice status changes to `issued`.
     */
    fulfillment_date?: string;
    payment_terms_id?: string;
    payment_reminder_id?: string;
    overdue_reminder_id?: string;
};

