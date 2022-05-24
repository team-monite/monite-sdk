/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartOrganizationCreatePayload } from './CounterpartOrganizationCreatePayload';

/**
 * This schema is used to create counterparts that are organizations (juridical persons).
 */
export type CounterpartOrganizationRootCreatePayload = {
  /**
   * Must be "organization".
   */
  type: CounterpartOrganizationRootCreatePayload.type;
  organization: CounterpartOrganizationCreatePayload;
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

export namespace CounterpartOrganizationRootCreatePayload {
  /**
   * Must be "organization".
   */
  export enum type {
    ORGANIZATION = 'organization',
  }
}
