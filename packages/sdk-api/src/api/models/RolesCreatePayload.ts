/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BizObjectsSchema } from './BizObjectsSchema';

export type RolesCreatePayload = {
    name: string;
    description?: string;
    /**
     * Access permissions
     */
    permissions: BizObjectsSchema;
};

