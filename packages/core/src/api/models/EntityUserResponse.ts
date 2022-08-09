/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityInfoSchema } from './EntityInfoSchema';
import type { FileSchema } from './FileSchema';
import type { RoleResponse } from './RoleResponse';
import type { StatusEnum } from './StatusEnum';

export type EntityUserResponse = {
    /**
     * UUID entity user ID
     */
    id: string;
    /**
     * Role assigned to this entity user
     */
    role?: RoleResponse;
    userpic?: FileSchema;
    info?: EntityInfoSchema;
    /**
     * Login
     */
    login: string;
    /**
     * First name
     */
    first_name?: string;
    /**
     * Last name
     */
    last_name?: string;
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

