/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { EntityAddressSchema } from './EntityAddressSchema';
import type { OptionalIndividualSchema } from './OptionalIndividualSchema';
import type { OptionalOrganizationSchema } from './OptionalOrganizationSchema';

/**
 * A schema for a request to update an entity
 */
export type UpdateEntityRequest = {
  /**
   * An address description of the entity
   */
  address?: EntityAddressSchema;
  /**
   * An official email address of the entity
   */
  email?: string;
  /**
   * A set of meta data describing the individual
   */
  individual?: OptionalIndividualSchema;
  /**
   * A set of meta data describing the organization
   */
  organization?: OptionalOrganizationSchema;
  /**
   * A phone number of the entity
   */
  phone?: string;
  /**
   * An identification number of the legal entity
   */
  tax_id?: string;
  /**
   * A website of the entity
   */
  website?: string;
};
