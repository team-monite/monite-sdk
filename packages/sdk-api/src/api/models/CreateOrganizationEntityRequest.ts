/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityAddressSchema } from './EntityAddressSchema';
import type { OrganizationSchema } from './OrganizationSchema';

/**
 * A base for an entity request schema
 */
export type CreateOrganizationEntityRequest = {
    /**
     * An address description of the entity
     */
    address: EntityAddressSchema;
    /**
     * An official email address of the entity
     */
    email: string;
    /**
     * A phone number of the entity
     */
    phone?: string;
    /**
     * A type for an organization
     */
    type: CreateOrganizationEntityRequest.type;
    /**
     * A set of meta data describing the organization
     */
    organization: OrganizationSchema;
};

export namespace CreateOrganizationEntityRequest {

    /**
     * A type for an organization
     */
    export enum type {
        ORGANIZATION = 'organization',
    }


}

