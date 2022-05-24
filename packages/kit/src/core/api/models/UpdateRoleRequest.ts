/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OptionalBizObjectsSchema } from './OptionalBizObjectsSchema';

export type UpdateRoleRequest = {
    /**
     * Role name
     */
    name?: string;
    /**
     * Access permissions
     */
    permissions?: OptionalBizObjectsSchema;
};
