/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityInfoSchema } from './EntityInfoSchema';

export type CreateEntityUserRequest = {
    /**
     * UUID of the role assigned to this entity user
     */
    role_id?: string;
    /**
     * Email, phone or login
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
     * Title
     */
    title?: string;
    /**
     * Additional information about an entity user
     */
    info?: EntityInfoSchema;
};
