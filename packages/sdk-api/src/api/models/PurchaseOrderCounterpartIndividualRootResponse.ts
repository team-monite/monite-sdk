/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartType } from './CounterpartType';
import type { PurchaseOrderCounterpartIndividualResponse } from './PurchaseOrderCounterpartIndividualResponse';

/**
 * Represents counterparts that are individuals (natural persons).
 */
export type PurchaseOrderCounterpartIndividualRootResponse = {
  /**
   * Unique ID of the counterpart.
   */
  id: string;
  /**
   * Date and time when the counterpart was created. Timestamps follow the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
   */
  created_at: string;
  /**
   * Date and time when the counterpart was last updated. Timestamps follow the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
   */
  updated_at: string;
  /**
   * `true` if the counterpart was created automatically by Monite when processing incoming invoices with OCR. `false` if the counterpart was created by the API client.
   */
  created_automatically?: boolean;
  /**
   * ID of the counterpart's billing address. If the counterpart is US-based and needs to accept ACH payments, this address must have all fields filled in. If `default_billing_address_id` is not defined, the default address is instead used as the billing address for ACH payments.
   */
  default_billing_address_id?: string;
  /**
   * ID of the shipping address.
   */
  default_shipping_address_id?: string;
  /**
   * Entity user ID of counterpart creator.
   */
  created_by_entity_user_id?: string;
  individual: PurchaseOrderCounterpartIndividualResponse;
  reminders_enabled?: boolean;
  /**
   * An identification number of the counterpart
   */
  tax_id?: string;
  /**
   * The counterpart type: `organization` (juridical person) or `individual` (natural person).
   */
  type: CounterpartType;
};
