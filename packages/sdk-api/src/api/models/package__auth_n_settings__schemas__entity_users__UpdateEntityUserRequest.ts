/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityInfoSchema } from './EntityInfoSchema';

export type package__auth_n_settings__schemas__entity_users__UpdateEntityUserRequest = {
    /**
     * UUID of the role assigned to this entity user
     */
    role_id?: string;
    /**
     * First name
     */
    first_name?: string;
    /**
     * Last name
     */
    last_name?: string;
    /**
     * Title
     */
    title?: string;
    /**
     * Login
     */
    login?: string;
    info?: EntityInfoSchema;
};

