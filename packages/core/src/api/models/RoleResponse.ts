/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BizObjectsSchema } from './BizObjectsSchema';
import type { StatusEnum } from './StatusEnum';

export type RoleResponse = {
    /**
     * UUID role ID
     */
    id: string;
    /**
     * Role name
     */
    name: string;
    /**
     * Access permissions
     */
    permissions: BizObjectsSchema;
    /**
     * record status, 'active' by default
     */
    status: StatusEnum;
    /**
     * UTC datetime
     */
    created_at: string;
    /**
     * UTC datetime
     */
    updated_at: string;
};

