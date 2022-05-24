/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntitySettingsSchema } from './EntitySettingsSchema';
import type { StatusEnum } from './StatusEnum';

export type CreateOrUpdateSettingsResponse = {
    settings?: EntitySettingsSchema;
    updated_at: string;
    created_at: string;
    status: StatusEnum;
    id: string;
};
