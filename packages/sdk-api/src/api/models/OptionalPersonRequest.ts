/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OptionalPersonAddress } from './OptionalPersonAddress';
import type { OptionalPersonRelationship } from './OptionalPersonRelationship';

export type OptionalPersonRequest = {
  /**
   * The person's address
   */
  address?: OptionalPersonAddress;
  /**
   * The person's date of birth
   */
  date_of_birth?: string;
  /**
   * The person's email address
   */
  email?: string;
  /**
   * The person's first name
   */
  first_name?: string;
  /**
   * The person's ID number, as appropriate for their country
   */
  id_number?: string;
  /**
   * The person's last name
   */
  last_name?: string;
  /**
   * The person's phone number
   */
  phone?: string;
  /**
   * Describes the person's relationship to the entity
   */
  relationship?: OptionalPersonRelationship;
  /**
   * The last four digits of the person's Social Security number
   */
  ssn_last_4?: string;
};
