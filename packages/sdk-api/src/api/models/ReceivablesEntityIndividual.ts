/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A Response schema for an entity of individual type
 */
export type ReceivablesEntityIndividual = {
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
   * A link to the entity logo
   */
  logo?: string;
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
  type: ReceivablesEntityIndividual.type;
  /**
   * A website of the entity
   */
  website?: string;
};

export namespace ReceivablesEntityIndividual {
  /**
   * The entity type
   */
  export enum type {
    INDIVIDUAL = 'individual',
  }
}
