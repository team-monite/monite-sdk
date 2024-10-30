/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Represents counterparts that are organizations (juridical persons).
 */
export type CounterpartOrganizationResponse = {
  /**
   * The legal name of the organization.
   */
  legal_name: string;
  /**
   * Indicates if the counterpart is a vendor.
   */
  is_vendor: boolean;
  /**
   * Indicates if the counterpart is a customer.
   */
  is_customer: boolean;
  /**
   * The phone number of the organization
   */
  phone?: string;
  /**
   * The email address of the organization
   */
  email?: string;
};
