/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WebhookSettingsResponse } from './WebhookSettingsResponse';

export type WebhookSettingsByObjectTypePaginationResponse = {
    /**
     * A set of webhook settings of different types returned per page
     */
    data: Array<WebhookSettingsResponse>;
    /**
     * A token that can be sent in the `pagination_token` query parameter to get the previous page of results, or `null` if there is no previous page (i.e. you've reached the first page).
     */
    prev_pagination_token?: string;
    /**
     * A token that can be sent in the `pagination_token` query parameter to get the next page of results, or `null` if there is no next page (i.e. you've reached the last page).
     */
    next_pagination_token?: string;
};

