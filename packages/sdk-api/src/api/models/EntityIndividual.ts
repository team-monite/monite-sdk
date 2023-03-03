/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A schema for an entity of individual type
 */
export type EntityIndividual = {
    /**
     * A phone number of the entity
     */
    phone?: string;
    /**
     * A link to the entity logo
     */
    logo?: string;
    /**
     * An email of the entity
     */
    email?: string;
    /**
     * The first name of the entity issuing the receivable
     */
    first_name: string;
    /**
     * The last name of the entity issuing the receivable
     */
    last_name: string;
    /**
     * The Tax ID of the entity issuing the receivable
     */
    tax_id?: string;
    /**
     * The entity type
     */
    type: EntityIndividual.type;
};

export namespace EntityIndividual {

    /**
     * The entity type
     */
    export enum type {
        INDIVIDUAL = 'individual',
    }


}

