/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AuditTrailRecord } from './AuditTrailRecord';

export type AuditTrailListResponse = {
    data: Array<AuditTrailRecord>;
    prev_pagination_token?: string;
    next_pagination_token?: string;
};
