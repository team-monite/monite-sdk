/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { EntityAddressSchema } from './EntityAddressSchema';
import type { EntityIndividualRequest } from './EntityIndividualRequest';
import type { EntityOrganizationRequest } from './EntityOrganizationRequest';

/**
 * Raise if None was explicitly passed to given fields
 */
export type UpdateIssuedInvoice = {
  /**
   * Unique ID of the counterpart contact.
   */
  contact_id?: string;
  /**
   * Id of a new or updated counterpart
   */
  counterpart_id?: string;
  /**
   * Counterpart VAT ID id
   */
  counterpart_vat_id_id?: string;
  entity?: EntityOrganizationRequest | EntityIndividualRequest;
  entity_address?: EntityAddressSchema;
  /**
   * Entity VAT ID id
   */
  entity_vat_id_id?: string;
  /**
   * The date when the goods are shipped or the service is provided.
   *
   * If omitted, defaults to the invoice issue date,
   * and the value is automatically set when the invoice status changes to `issued`.
   */
  fulfillment_date?: string;
  /**
   * A note with additional information for a receivable
   */
  memo?: string;
  overdue_reminder_id?: string;
  /**
   * Metadata for partner needs
   */
  partner_metadata?: Record<string, any>;
  payment_reminder_id?: string;
  payment_terms_id?: string;
};
