/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { SecretStatusEnum } from './SecretStatusEnum';

export type GetSecretsResponseSecret = {
  id: string;
  created_at: string;
  client_id: string;
  client_secret_mask: string;
  last_used_at?: string;
  name?: string;
  revoke_datetime?: string;
  status: SecretStatusEnum;
};
