/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { GrantType } from './GrantType';

export type ObtainTokenPayload = {
  client_id: string;
  client_secret: string;
  entity_user_id?: string;
  grant_type: GrantType;
};
