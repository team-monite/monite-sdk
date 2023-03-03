/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TodoTaskResponse } from './TodoTaskResponse';

export type PaginatedTodoTask = {
    data: Array<TodoTaskResponse>;
    /**
     * A token that can be sent in the `pagination_token` query parameter to get the previous page of results. If there is no previous page, i.e. you have reached the first page, the value is `null`.
     */
    prev_pagination_token?: string;
    /**
     * A token that can be sent in the `pagination_token` query parameter to get the next page of results. If there is no next page, i.e. you have reached the last page, the value is `null`.
     */
    next_pagination_token?: string;
};

