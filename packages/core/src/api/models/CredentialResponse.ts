/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CredentialResponse = {
    name?: string;
    id: string;
    client_id: string;
    client_secret_mask: string;
    last_used_at?: string;
    is_revoked: boolean;
    revoke_datetime?: string;
};

