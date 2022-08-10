/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectType } from './ObjectType';

export type CreateWebhookRequest = {
    object_type: ObjectType;
    url: string;
};

