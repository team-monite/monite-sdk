/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ApprovalStatusEnum } from './ApprovalStatusEnum';
import type { ObjectType } from './ObjectType';

export type ApprovalResponse = {
    id: string;
    object_type: ObjectType;
    object_id: string;
    action_name: string;
    status: ApprovalStatusEnum;
    created_at: string;
    updated_at: string;
};
