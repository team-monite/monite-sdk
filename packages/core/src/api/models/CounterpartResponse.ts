/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartIndividualResponse } from './CounterpartIndividualResponse';
import type { CounterpartOrganizationResponse } from './CounterpartOrganizationResponse';

/**
 * A Counterpart object contains information about an organization (juridical person) or
 * individual (natural person) that provides goods and services to or buys them from an
 * [SME](https://monite.stoplight.io/docs/api-docs/ZG9jOjQyMDM0NzMx-glossary#sme).
 */
export type CounterpartResponse = (CounterpartIndividualResponse | CounterpartOrganizationResponse);

