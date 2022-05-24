/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityAddressSchema } from './EntityAddressSchema';
import type { IndividualSchema } from './IndividualSchema';

/**
 * An interface to flatten schema's field
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
     * @TODO: What is that field for ?
     */
    partner_reference?: string;
    /**
     * A phone number of the entity
     */
    phone?: string;
    /**
     * A type for an organization
     */
    type: CreateIndividualEntityRequest.type;
    /**
     * A set of meta data describing the individal
     */
    individual: IndividualSchema;
};

export namespace CreateIndividualEntityRequest {

    /**
     * A type for an organization
     */
    export enum type {
        INDIVIDUAL = 'individual',
    }


}
