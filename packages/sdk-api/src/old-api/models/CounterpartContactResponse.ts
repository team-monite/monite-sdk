/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartAddress } from './CounterpartAddress';

/**
 * The contact person for an organization.
 */
export type CounterpartContactResponse = {
  /**
   * The first name of a contact person.
   */
  first_name: string;
  /**
   * The last name of a contact person.
   */
  last_name: string;
  /**
   * The email address of a contact person.
   */
  email?: string;
  /**
   * The phone number of a contact person
   */
  phone?: string;
  /**
   * The address of a contact person.
   */
  address: CounterpartAddress;
  /**
   * The title or honorific of a contact person. Examples: Mr., Ms., Dr., Prof.
   */
  title?: string;
  id: string;
  counterpart_id: string;
  is_default: boolean;
};
