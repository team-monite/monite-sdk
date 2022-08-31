/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityAddressSchema } from './EntityAddressSchema';
import type { OptionalOrganizationSchema } from './OptionalOrganizationSchema';

/**
 * A base for entity related schemas of different types
 */
export type UpdateOrganizationEntityRequest = {
    /**
     * An address description of the entity
     */
    address?: EntityAddressSchema;
    /**
     * An official email address of the entity
     */
    email?: string;
    /**
     * A phone number of the entity
     */
    phone?: string;
    /**
     * A set of meta data describing the organization
     */
    organization?: OptionalOrganizationSchema;
};

