/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartIndividualUpdatePayload } from './CounterpartIndividualUpdatePayload';

/**
 * Represents counterparts that are individuals (natural persons).
 */
export type CounterpartIndividualRootUpdatePayload = {
  /**
   * ID of the shipping address.
   */
  default_shipping_address_id?: string;
  /**
   * ID of the counterpart's billing address. If the counterpart is US-based and needs to accept ACH payments, this address must have all fields filled in. If `default_billing_address_id` is not defined, the default address is instead used as the billing address for ACH payments.
   */
  default_billing_address_id?: string;
  individual: CounterpartIndividualUpdatePayload;
  reminders_enabled?: boolean;
  /**
   * An identification number of the counterpart
   */
  tax_id?: string;
  /**
   * Must be "individual".
   */
  type: CounterpartIndividualRootUpdatePayload.type;
  /**
   * `true` if the counterpart was created automatically by Monite when processing incoming invoices with OCR. `false` if the counterpart was created by the API client.
   */
  created_automatically?: boolean;
};

export namespace CounterpartIndividualRootUpdatePayload {
  /**
   * Must be "individual".
   */
  export enum type {
    INDIVIDUAL = 'individual',
  }
}
