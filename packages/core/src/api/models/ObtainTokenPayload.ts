/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GrantType } from './GrantType';

export type ObtainTokenPayload = {
    grant_type: GrantType;
    client_id: string;
    client_secret: string;
    entity_user_id?: string;
};

