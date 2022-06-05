/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UpdateIndividualEntityRequest } from './UpdateIndividualEntityRequest';
import type { UpdateOrganizationEntityRequest } from './UpdateOrganizationEntityRequest';

/**
 * A schema for a request to update an entity
 */
export type UpdateEntityRequest = (UpdateOrganizationEntityRequest | UpdateIndividualEntityRequest);
