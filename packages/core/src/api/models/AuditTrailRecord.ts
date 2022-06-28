/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReqestData } from './ReqestData';
import type { ResponseData } from './ResponseData';

export type AuditTrailRecord = {
    partner_id?: string;
    entity_id?: string;
    entity_user_id?: string;
    request: ReqestData;
    response: ResponseData;
    target_resource?: string;
    id: string;
    created_at: string;
    updated_at: string;
};
