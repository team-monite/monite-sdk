/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ApprovalStatusResponse } from './ApprovalStatusResponse';

export type WorkflowPipelineApprovals = {
    approvals: Array<ApprovalStatusResponse>;
    required_number_of_users_to_approve: number;
    remaining_number_of_users_to_approve: number;
};

