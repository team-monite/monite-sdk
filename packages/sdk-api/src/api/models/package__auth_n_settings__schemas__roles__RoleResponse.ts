/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { package__auth_n_settings__schemas__roles__BizObjectsSchema } from './package__auth_n_settings__schemas__roles__BizObjectsSchema';
import type { StatusEnum } from './StatusEnum';

export type package__auth_n_settings__schemas__roles__RoleResponse = {
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
    permissions: package__auth_n_settings__schemas__roles__BizObjectsSchema;
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

