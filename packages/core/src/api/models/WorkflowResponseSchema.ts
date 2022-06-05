/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActionEnum } from './ActionEnum';
import type { StatusEnum } from './StatusEnum';

export type WorkflowResponseSchema = {
    id: string;
    created_by_entity_user_id: string;
    object_type: string;
    workflow: Array<any>;
    trigger: any;
    action: ActionEnum;
    status: StatusEnum;
    created_at: string;
    updated_at: string;
};
