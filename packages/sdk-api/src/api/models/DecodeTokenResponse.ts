/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityWBankAccountsResponse } from './EntityWBankAccountsResponse';
import type { MergedSettingsResponse } from './MergedSettingsResponse';
import type { package__auth_n_settings__schemas__entity_users__EntityUserResponse } from './package__auth_n_settings__schemas__entity_users__EntityUserResponse';
import type { Partner } from './Partner';
import type { Project } from './Project';

export type DecodeTokenResponse = {
    project: Project;
    settings?: MergedSettingsResponse;
    entity_user?: package__auth_n_settings__schemas__entity_users__EntityUserResponse;
    entity?: EntityWBankAccountsResponse;
    partner: Partner;
};

