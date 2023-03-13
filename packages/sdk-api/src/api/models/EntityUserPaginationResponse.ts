/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { package__auth_n_settings__v2023_02_07__schemas__entity_users__EntityUserResponse } from './package__auth_n_settings__v2023_02_07__schemas__entity_users__EntityUserResponse';

export type EntityUserPaginationResponse = {
    /**
     * array of records
     */
    data: Array<package__auth_n_settings__v2023_02_07__schemas__entity_users__EntityUserResponse>;
    /**
     * A token that can be sent in the `pagination_token` query parameter to get the previous page of results, or `null` if there is no previous page (i.e. you've reached the first page).
     */
    prev_pagination_token?: string;
    /**
     * A token that can be sent in the `pagination_token` query parameter to get the next page of results, or `null` if there is no next page (i.e. you've reached the last page).
     */
    next_pagination_token?: string;
};

