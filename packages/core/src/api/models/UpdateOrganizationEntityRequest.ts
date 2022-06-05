/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityAddressSchema } from './EntityAddressSchema';
import type { OptionalOrganizationSchema } from './OptionalOrganizationSchema';

/**
 * An interface to flatten schema's field
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
     * @TODO: What is that field for ?
     */
    partner_reference?: string;
    /**
     * A phone number of the entity
     */
    phone?: string;
    /**
     * A set of meta data describing the organization
     */
    organization?: OptionalOrganizationSchema;
};
