/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityUserResponse } from './EntityUserResponse';
import type { EntityWBankAccountsResponse } from './EntityWBankAccountsResponse';
import type { MergedSettingsResponse } from './MergedSettingsResponse';
import type { Partner } from './Partner';
import type { Project } from './Project';

export type DecodeTokenResponse = {
    project: Project;
    settings?: MergedSettingsResponse;
    entity_user?: EntityUserResponse;
    entity?: EntityWBankAccountsResponse;
    partner: Partner;
};

