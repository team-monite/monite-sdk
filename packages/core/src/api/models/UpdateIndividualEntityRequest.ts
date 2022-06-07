/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityAddressSchema } from './EntityAddressSchema';
import type { OptionalIndividualSchema } from './OptionalIndividualSchema';

/**
 * An interface to flatten schema's field
 */
export type UpdateIndividualEntityRequest = {
    /**
     * An address description of the entity
     */
    address?: EntityAddressSchema;
    /**
     * An official email address of the entity
     */
    email?: string;
    /**
     * An ID used by a Partner in their systems to identify this resource
     */
    partner_reference?: string;
    /**
     * A phone number of the entity
     */
    phone?: string;
    /**
     * A set of meta data describing the individual
     */
    individual?: OptionalIndividualSchema;
};
