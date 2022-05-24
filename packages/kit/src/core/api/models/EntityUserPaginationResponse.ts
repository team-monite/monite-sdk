/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityUserResponse } from './EntityUserResponse';

export type EntityUserPaginationResponse = {
    /**
     * array of records
     */
    data: Array<EntityUserResponse>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};
