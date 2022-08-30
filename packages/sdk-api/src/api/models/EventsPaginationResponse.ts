/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EventsResponse } from './EventsResponse';

export type EventsPaginationResponse = {
    /**
     * A set of events returned per page
     */
    data: Array<EventsResponse>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};

