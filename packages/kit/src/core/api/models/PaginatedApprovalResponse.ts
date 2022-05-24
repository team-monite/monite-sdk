/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ApprovalResponse } from './ApprovalResponse';

export type PaginatedApprovalResponse = {
    data: Array<ApprovalResponse>;
    next_pagination_token?: string;
    prev_pagination_token?: string;
};
