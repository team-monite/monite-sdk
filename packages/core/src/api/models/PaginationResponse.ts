/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PayableResponseSchema } from './PayableResponseSchema';

export type PaginationResponse = {
    data: Array<PayableResponseSchema>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};
