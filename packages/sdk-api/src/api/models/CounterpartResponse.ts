/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartIndividualRootResponse } from './CounterpartIndividualRootResponse';
import type { CounterpartOrganizationRootResponse } from './CounterpartOrganizationRootResponse';

/**
 * A Counterpart object contains information about an organization (juridical person) or
 * individual (natural person) that provides goods and services to or buys them from an
 * [SME](https://docs.monite.com/docs/glossary#sme).
 */
export type CounterpartResponse =
  | CounterpartIndividualRootResponse
  | CounterpartOrganizationRootResponse;
