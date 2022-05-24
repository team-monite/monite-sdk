/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CreateIndividualEntityRequest } from './CreateIndividualEntityRequest';
import type { CreateOrganizationEntityRequest } from './CreateOrganizationEntityRequest';

/**
 * A schema for a request to create an entity of different types
 */
export type CreateEntityRequest = (CreateOrganizationEntityRequest | CreateIndividualEntityRequest);
