/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivableResponse } from './ReceivableResponse';

/**
 * A paginated list of receivables
 */
export type PaginationResponse = {
    data: Array<ReceivableResponse>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};

