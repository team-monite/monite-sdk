/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityAddressSchema } from './EntityAddressSchema';
import type { FileSchema } from './FileSchema';
import type { MailboxResponse } from './MailboxResponse';
import type { OrganizationSchema } from './OrganizationSchema';
import type { StatusEnum } from './StatusEnum';

/**
 * A base for an entity response schema
 */
export type EntityOrganizationResponse = {
    /**
     * An address description of the entity
     */
    address: EntityAddressSchema;
    /**
     * An official email address of the entity
     */
    email: string;
    /**
     * An ID used by a Partner in their systems to identify this resource
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
     * A type for an organization
     */
    type: EntityOrganizationResponse.type;
    /**
     * A set of metadata describing an organization
     */
    organization: OrganizationSchema;
};

export namespace EntityOrganizationResponse {

    /**
     * A type for an organization
     */
    export enum type {
        ORGANIZATION = 'organization',
    }


}
