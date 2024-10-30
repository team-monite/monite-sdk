/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartAddress } from './CounterpartAddress';
import type { ReceivableCounterpartContact } from './ReceivableCounterpartContact';
import type { UpdateLineItemForCreditNote } from './UpdateLineItemForCreditNote';

export type UpdateCreditNote = {
  counterpart_address?: CounterpartAddress;
  /**
   * Additional information about counterpart contacts.
   */
  counterpart_contact?: ReceivableCounterpartContact;
  line_items?: UpdateLineItemForCreditNote;
  /**
   * A note with additional information for a receivable
   */
  memo?: string;
  /**
   * Metadata for partner needs
   */
  partner_metadata?: Record<string, any>;
};
