/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EntityOrganization = {
    /**
     * The name of the entity issuing the receivable, when it is an organization.
     */
    name: string;
    /**
     * The VAT ID of the entity issuing the receivable, when it is an organization.
     */
    vat_id: string;
    /**
     * The entity type.
     */
    type: EntityOrganization.type;
};

export namespace EntityOrganization {

    /**
     * The entity type.
     */
    export enum type {
        ORGANIZATION = 'organization',
    }


}
