/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowResponseSchema } from './WorkflowResponseSchema';

export type WorkflowsPaginationResponse = {
    /**
     * array of records
     */
    data: Array<WorkflowResponseSchema>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};
