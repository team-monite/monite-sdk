/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Represents counterparts that are organizations (juridical persons).
 */
export type PurchaseOrderCounterpartOrganizationResponse = {
  /**
   * The email address of the organization
   */
  email?: string;
  /**
   * Indicates if the counterpart is a customer.
   */
  is_customer: boolean;
  /**
   * Indicates if the counterpart is a vendor.
   */
  is_vendor: boolean;
  /**
   * The legal name of the organization.
   */
  legal_name: string;
  /**
   * The phone number of the organization
   */
  phone?: string;
};
