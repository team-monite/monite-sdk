/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { package__auth_n_settings__schemas__roles__BizObjectsSchema } from './package__auth_n_settings__schemas__roles__BizObjectsSchema';

export type RolesCreatePayload = {
    name: string;
    description?: string;
    /**
     * Access permissions
     */
    permissions: package__auth_n_settings__schemas__roles__BizObjectsSchema;
};

