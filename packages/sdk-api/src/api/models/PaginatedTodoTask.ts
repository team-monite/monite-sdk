/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TodoTask } from './TodoTask';

export type PaginatedTodoTask = {
    data: Array<TodoTask>;
    next_pagination_token?: string;
    prev_pagination_token?: string;
};

