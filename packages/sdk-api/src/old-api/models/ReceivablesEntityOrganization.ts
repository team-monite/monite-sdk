/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A Response schema for an entity of organization type
 */
export type ReceivablesEntityOrganization = {
  /**
   * An email of the entity
   */
  email?: string;
  /**
   * A link to the entity logo
   */
  logo?: string;
  /**
   * The name of the entity issuing the receivable, when it is an organization.
   */
  name: string;
  /**
   * A phone number of the entity
   */
  phone?: string;
  /**
   * The Tax ID of the entity issuing the receivable
   */
  tax_id?: string;
  /**
   * The entity type
   */
  type: ReceivablesEntityOrganization.type;
  /**
   * The VAT ID of the entity issuing the receivable, when it is an organization.
   */
  vat_id?: string;
  /**
   * A website of the entity
   */
  website?: string;
};

export namespace ReceivablesEntityOrganization {
  /**
   * The entity type
   */
  export enum type {
    ORGANIZATION = 'organization',
  }
}
