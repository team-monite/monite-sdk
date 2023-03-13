/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FileSchema } from './FileSchema';
import type { package__auth_n_settings__v2023_02_07__schemas__roles__RoleResponse } from './package__auth_n_settings__v2023_02_07__schemas__roles__RoleResponse';
import type { StatusEnum } from './StatusEnum';

/**
 * A scheme for validation an entity user additional info
 */
export type package__auth_n_settings__v2023_02_07__schemas__entity_users__EntityUserResponse = {
    /**
     * An entity user business email
     */
    email?: string;
    /**
     * An entity user phone number in the international format
     */
    phone?: string;
    /**
     * UUID entity user ID
     */
    id: string;
    /**
     * Role assigned to this entity user
     */
    role?: package__auth_n_settings__v2023_02_07__schemas__roles__RoleResponse;
    userpic?: FileSchema;
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

