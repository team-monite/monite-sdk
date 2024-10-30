/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { EntityAddressSchema } from './EntityAddressSchema';
import type { EntityTypeEnum } from './EntityTypeEnum';
import type { IndividualSchema } from './IndividualSchema';
import type { OrganizationSchemaRequest } from './OrganizationSchemaRequest';

/**
 * A schema for a request to create an entity of different types
 */
export type CreateEntityRequest = {
  /**
   * An address description of the entity
   */
  address: EntityAddressSchema;
  /**
   * An official email address of the entity
   */
  email: string;
  /**
   * A set of meta data describing the individual
   */
  individual?: IndividualSchema;
  /**
   * A set of meta data describing the organization
   */
  organization?: OrganizationSchemaRequest;
  /**
   * A phone number of the entity
   */
  phone?: string;
  /**
   * An identification number of the legal entity
   */
  tax_id?: string;
  /**
   * A type for an entity
   */
  type: EntityTypeEnum;
  /**
   * A website of the entity
   */
  website?: string;
};
