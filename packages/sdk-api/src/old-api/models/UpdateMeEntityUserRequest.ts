/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A scheme for validation an entity user additional info
 */
export type UpdateMeEntityUserRequest = {
  /**
   * An entity user business email
   */
  email?: string;
  /**
   * First name
   */
  first_name?: string;
  /**
   * Last name
   */
  last_name?: string;
  /**
   * An entity user phone number in the international format
   */
  phone?: string;
  /**
   * Title
   */
  title?: string;
};
