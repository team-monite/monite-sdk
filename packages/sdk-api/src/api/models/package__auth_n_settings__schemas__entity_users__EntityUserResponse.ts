/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityInfoSchema } from './EntityInfoSchema';
import type { FileSchema } from './FileSchema';
import type { package__auth_n_settings__schemas__roles__RoleResponse } from './package__auth_n_settings__schemas__roles__RoleResponse';
import type { StatusEnum } from './StatusEnum';

export type package__auth_n_settings__schemas__entity_users__EntityUserResponse = {
    /**
     * UUID entity user ID
     */
    id: string;
    /**
     * Role assigned to this entity user
     */
    role?: package__auth_n_settings__schemas__roles__RoleResponse;
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

