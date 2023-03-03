/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityAddressSchema } from './EntityAddressSchema';
import type { IndividualSchema } from './IndividualSchema';

/**
 * A base for an entity request schema
 */
export type CreateIndividualEntityRequest = {
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
    type: 'individual';
    /**
     * A set of meta data describing the individual
     */
    individual: IndividualSchema;
};

