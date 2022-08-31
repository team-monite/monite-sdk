/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityInfoSchema } from './EntityInfoSchema';

export type CreateEntityUserRequest = {
    login: string;
    info?: EntityInfoSchema;
    /**
     * UUID of the role assigned to this entity user
     */
    role_id?: string;
    /**
     * First name
     */
    first_name: string;
    /**
     * Last name
     */
    last_name?: string;
    /**
     * Title
     */
    title?: string;
};

