/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OptionalIndividualPayload } from './OptionalIndividualPayload';
import type { OptionalOrganizationPayload } from './OptionalOrganizationPayload';

/**
 * This schema is used to update existing counterparts (organizations or individuals).
 */
export type CounterpartUpdatePayload = (OptionalIndividualPayload | OptionalOrganizationPayload);
