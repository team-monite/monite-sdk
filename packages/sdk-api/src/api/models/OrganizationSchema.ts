/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A schema contains metadata for an organization
 */
export type OrganizationSchema = {
    /**
     * A legal name of an organization
     */
    legal_name: string;
    /**
     * A VAT number of the entity which points to the registered tax applied for a service price
     */
    vat_id: string;
    /**
     * A code which identifies uniquely a party of a transaction worldwide
     */
    legal_entity_id?: string;
};

