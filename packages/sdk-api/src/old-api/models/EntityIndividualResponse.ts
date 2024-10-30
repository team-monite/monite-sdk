/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { EntityAddressSchema } from './EntityAddressSchema';
import type { IndividualSchema } from './IndividualSchema';
import type { package__entities__unversioned__schemas__file_saver__FileSchema } from './package__entities__unversioned__schemas__file_saver__FileSchema';
import type { StatusEnum } from './StatusEnum';

/**
 * A base for an entity response schema
 */
export type EntityIndividualResponse = {
  /**
   * UUID entity ID
   */
  id: string;
  /**
   * UTC datetime
   */
  created_at: string;
  /**
   * UTC datetime
   */
  updated_at: string;
  /**
   * An address description of the entity
   */
  address: EntityAddressSchema;
  /**
   * An official email address of the entity
   */
  email?: string;
  /**
   * A set of metadata describing an individual
   */
  individual: IndividualSchema;
  /**
   * A logo image of the entity
   */
  logo?: package__entities__unversioned__schemas__file_saver__FileSchema;
  /**
   * A phone number of the entity
   */
  phone?: string;
  /**
   * record status, 'active' by default
   */
  status: StatusEnum;
  /**
   * An identification number of the legal entity
   */
  tax_id?: string;
  /**
   * A type for an individual
   */
  type: 'individual';
  /**
   * A website of the entity
   */
  website?: string;
};
