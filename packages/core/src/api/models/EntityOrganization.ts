/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A schema for an entity of organization type
 */
export type EntityOrganization = {
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
     * The name of the entity issuing the receivable, when it is an organization.
     */
    name: string;
    /**
     * The VAT ID of the entity issuing the receivable, when it is an organization.
     */
    vat_id: string;
    /**
     * The entity type
     */
    type: EntityOrganization.type;
};

export namespace EntityOrganization {

    /**
     * The entity type
     */
    export enum type {
        ORGANIZATION = 'organization',
    }


}
