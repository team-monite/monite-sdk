/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProductServiceResponse } from './ProductServiceResponse';

/**
 * A paginated list of products and services
 */
export type ProductServicePaginationResponse = {
    data: Array<ProductServiceResponse>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};

