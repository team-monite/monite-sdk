/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityAddressSchema } from './EntityAddressSchema';
import type { FileSchema } from './FileSchema';
import type { IndividualSchema } from './IndividualSchema';
import type { MailboxResponse } from './MailboxResponse';
import type { StatusEnum } from './StatusEnum';

/**
 * A base for an entity response schema
 */
export type EntityIndividualResponse = {
    /**
     * An address description of the entity
     */
    address: EntityAddressSchema;
    /**
     * An official email address of the entity
     */
    email: string;
    /**
     * @TODO: What is that field for ?
     */
    partner_reference?: string;
    /**
     * A phone number of the entity
     */
    phone?: string;
    /**
     * UTC datetime
     */
    created_at: string;
    /**
     * UUID entity ID
     */
    id: string;
    mailboxes: Array<MailboxResponse>;
    /**
     * A logo image of the entity
     */
    logo?: FileSchema;
    /**
     * record status, 'active' by default
     */
    status: StatusEnum;
    /**
     * UTC datetime
     */
    updated_at: string;
    /**
     * A type for an individual
     */
    type: EntityIndividualResponse.type;
    /**
     * A set of metadata describing an individual
     */
    individual: IndividualSchema;
};

export namespace EntityIndividualResponse {

    /**
     * A type for an individual
     */
    export enum type {
        INDIVIDUAL = 'individual',
    }


}
