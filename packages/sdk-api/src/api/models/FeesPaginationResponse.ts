/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FeeResponse } from './FeeResponse';

export type FeesPaginationResponse = {
    /**
     * array of fees
     */
    data: Array<FeeResponse>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};

