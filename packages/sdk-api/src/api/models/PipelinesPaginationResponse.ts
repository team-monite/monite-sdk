/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PipelineResponseSchema } from './PipelineResponseSchema';

export type PipelinesPaginationResponse = {
    /**
     * A paginated list of pipelines.
     */
    data: Array<PipelineResponseSchema>;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    prev_pagination_token?: string;
    /**
     * optional querystring with pagination parameters, null if there is no page
     */
    next_pagination_token?: string;
};

