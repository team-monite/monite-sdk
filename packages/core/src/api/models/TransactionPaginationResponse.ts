/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TransactionResponse } from './TransactionResponse';

export type TransactionPaginationResponse = {
    /**
     * array of records
     */
    data: Array<TransactionResponse>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};
