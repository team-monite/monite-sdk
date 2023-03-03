/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityAddressSchema } from './EntityAddressSchema';
import type { OrganizationSchemaRequest } from './OrganizationSchemaRequest';

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
    type: 'organization';
    /**
     * A set of meta data describing the organization
     */
    organization: OrganizationSchemaRequest;
};

