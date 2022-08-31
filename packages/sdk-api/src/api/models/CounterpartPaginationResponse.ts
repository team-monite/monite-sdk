/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartResponse } from './CounterpartResponse';

/**
 * A paginated list of counterparts
 */
export type CounterpartPaginationResponse = {
    data: Array<CounterpartResponse>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};

