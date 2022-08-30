/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WebhookResponse } from './WebhookResponse';

export type WebhooksPaginationResponse = {
    /**
     * A set of webhooks returned per page
     */
    data: Array<WebhookResponse>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};

