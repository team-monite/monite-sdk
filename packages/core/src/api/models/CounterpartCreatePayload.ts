/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartCreateIndividualPayload } from './CounterpartCreateIndividualPayload';
import type { CounterpartCreateOrganizationPayload } from './CounterpartCreateOrganizationPayload';

/**
 * This schema is used to create new counterparts (either organizations or individuals).
 * The counterpart type is specified by the `type` property. Depending on the `type`,
 * you need to provide the data for either the `individual` or `organization` property.
 */
export type CounterpartCreatePayload = (CounterpartCreateOrganizationPayload | CounterpartCreateIndividualPayload);

