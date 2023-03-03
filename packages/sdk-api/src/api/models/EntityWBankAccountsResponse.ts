/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityIndividualWBankAccountResponse } from './EntityIndividualWBankAccountResponse';
import type { EntityOrganizationWBankAccountResponse } from './EntityOrganizationWBankAccountResponse';

/**
 * A schema for a response after creation of an entity of different types
 */
export type EntityWBankAccountsResponse = (EntityOrganizationWBankAccountResponse | EntityIndividualWBankAccountResponse);

