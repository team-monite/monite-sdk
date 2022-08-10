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
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};

