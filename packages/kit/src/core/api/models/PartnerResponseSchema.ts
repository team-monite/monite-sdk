/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ResponseSettings } from './ResponseSettings';
import type { StatusEnum } from './StatusEnum';

export type PartnerResponseSchema = {
    settings?: ResponseSettings;
    updated_at: string;
    created_at: string;
    name: string;
    status: StatusEnum;
    id: string;
};
