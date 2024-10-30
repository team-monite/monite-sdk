/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartIndividualCreatePayload } from './CounterpartIndividualCreatePayload';

/**
 * This schema is used to create counterparts that are individuals (natural persons).
 */
export type CounterpartIndividualRootCreatePayload = {
  /**
   * Must be "individual".
   */
  type: CounterpartIndividualRootCreatePayload.type;
  individual: CounterpartIndividualCreatePayload;
  reminders_enabled?: boolean;
  /**
   * An identification number of the counterpart
   */
  tax_id?: string;
  /**
   * `true` if the counterpart was created automatically by Monite when processing incoming invoices with OCR. `false` if the counterpart was created by the API client.
   */
  created_automatically?: boolean;
};

export namespace CounterpartIndividualRootCreatePayload {
  /**
   * Must be "individual".
   */
  export enum type {
    INDIVIDUAL = 'individual',
  }
}
