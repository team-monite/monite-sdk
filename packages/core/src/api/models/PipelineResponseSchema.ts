/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowPipelineStatusEnum } from './WorkflowPipelineStatusEnum';

export type PipelineResponseSchema = {
    id: string;
    object_type: string;
    object_id: string;
    error_text?: string;
    status: WorkflowPipelineStatusEnum;
    workflow_id: string;
    created_at: string;
    updated_at: string;
};
