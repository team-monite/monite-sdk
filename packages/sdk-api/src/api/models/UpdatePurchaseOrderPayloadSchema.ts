/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { PurchaseOrderItem } from './PurchaseOrderItem';

/**
 * Represents an Accounts Purchase Order document created by entity.
 */
export type UpdatePurchaseOrderPayloadSchema = {
  /**
   * Counterpart unique ID.
   */
  counterpart_id?: string;
  /**
   * Entity VAT ID identifier that applied to purchase order
   */
  entity_vat_id_id?: string;
  /**
   * List of item to purchase
   */
  items?: Array<PurchaseOrderItem>;
  /**
   * Msg which will be send to counterpart for who the purchase order is issued.
   */
  message?: string;
  /**
   * Number of days for which purchase order is valid
   */
  valid_for_days?: number;
};
