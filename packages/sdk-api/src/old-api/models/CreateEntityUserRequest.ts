/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A scheme for validation an entity user additional info
 */
export type CreateEntityUserRequest = {
  /**
   * An entity user business email
   */
  email?: string;
  /**
   * First name
   */
  first_name: string;
  /**
   * Last name
   */
  last_name?: string;
  login: string;
  /**
   * An entity user phone number in the international format
   */
  phone?: string;
  /**
   * UUID of the role assigned to this entity user
   */
  role_id?: string;
  /**
   * Title
   */
  title?: string;
};
