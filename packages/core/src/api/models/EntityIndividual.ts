/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EntityIndividual = {
    /**
     * The first name of the entity issuing the receivable, when it is an individual.
     */
    first_name: string;
    /**
     * The last name of the entity issuing the receivable, when it is an individual.
     */
    last_name: string;
    /**
     * The Tax ID of the entity issuing the receivable, when it is an individual.
     */
    tax_id: string;
    /**
     * An entity type
     */
    type: EntityIndividual.type;
};

export namespace EntityIndividual {

    /**
     * An entity type
     */
    export enum type {
        INDIVIDUAL = 'individual',
    }


}
