/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityResponse } from './EntityResponse';

export type EntityPaginationResponse = {
    /**
     * A set of entities of different types returned per page
     */
    data: Array<EntityResponse>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};
