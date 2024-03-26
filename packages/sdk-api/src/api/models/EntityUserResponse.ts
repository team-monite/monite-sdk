/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { StatusEnum } from './StatusEnum';

/**
 * A scheme for validation an entity user additional info
 */
export type EntityUserResponse = {
  /**
   * UUID entity user ID
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
   * Login
   */
  login: string;
  /**
   * An entity user phone number in the international format
   */
  phone?: string;
  /**
   * UUID role ID
   */
  role_id: string;
  /**
   * record status, 'active' by default
   */
  status: StatusEnum;
  userpic_file_id?: string;
};
