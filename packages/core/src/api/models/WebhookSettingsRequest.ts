/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectType } from './ObjectType';

export type WebhookSettingsRequest = {
    object_type: ObjectType;
    urls: Array<string>;
};
