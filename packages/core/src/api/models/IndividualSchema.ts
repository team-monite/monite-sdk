/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A schema contains metadata for an individual
 */
export type IndividualSchema = {
    /**
     * A first name of an individual
     */
    first_name: string;
    /**
     * A last name of an individual
     */
    last_name: string;
    /**
     * A VAT number of the entity which points to the registered tax applied for a service price
     */
    vat_id?: string;
    /**
     * An identification number of the legal entity
     */
    tax_id?: string;
    /**
     * A title of an individual
     */
    title?: string;
};

