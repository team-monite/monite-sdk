/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartIndividualRootCreatePayload } from './CounterpartIndividualRootCreatePayload';
import type { CounterpartOrganizationRootCreatePayload } from './CounterpartOrganizationRootCreatePayload';

/**
 * This schema is used to create new counterparts (either organizations or individuals).
 * The counterpart type is specified by the `type` property. Depending on the `type`,
 * you need to provide the data for either the `individual` or `organization` property.
 */
export type CounterpartCreatePayload =
  | CounterpartOrganizationRootCreatePayload
  | CounterpartIndividualRootCreatePayload;
