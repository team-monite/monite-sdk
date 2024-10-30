/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Represents counterparts that are individuals (natural persons).
 */
export type PurchaseOrderCounterpartIndividualResponse = {
  /**
   * The person's email address.
   */
  email?: string;
  /**
   * The person's first name.
   */
  first_name: string;
  /**
   * Indicates if the counterpart is a customer.
   */
  is_customer: boolean;
  /**
   * Indicates if the counterpart is a vendor.
   */
  is_vendor: boolean;
  /**
   * The person's last name.
   */
  last_name: string;
  /**
   * The person's phone number.
   */
  phone?: string;
  /**
   * The person's title or honorific. Examples: Mr., Ms., Dr., Prof.
   */
  title?: string;
};
