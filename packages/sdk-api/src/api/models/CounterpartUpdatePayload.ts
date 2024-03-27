/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartIndividualRootUpdatePayload } from './CounterpartIndividualRootUpdatePayload';
import type { CounterpartOrganizationRootUpdatePayload } from './CounterpartOrganizationRootUpdatePayload';

/**
 * This schema is used to update existing counterparts (organizations or individuals).
 */
export type CounterpartUpdatePayload =
  | CounterpartIndividualRootUpdatePayload
  | CounterpartOrganizationRootUpdatePayload;
