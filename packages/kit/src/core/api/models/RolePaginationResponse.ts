/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RoleResponse } from './RoleResponse';

export type RolePaginationResponse = {
    /**
     * array of records
     */
    data: Array<RoleResponse>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};
