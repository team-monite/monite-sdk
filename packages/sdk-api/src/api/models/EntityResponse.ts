/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { EntityIndividualResponse } from './EntityIndividualResponse';
import type { EntityOrganizationResponse } from './EntityOrganizationResponse';

/**
 * A schema for a response after creation of an entity of different types
 */
export type EntityResponse =
  | EntityOrganizationResponse
  | EntityIndividualResponse;
