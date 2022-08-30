/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateCredentialResponse = {
    name?: string;
    id: string;
    client_id: string;
    client_secret_mask: string;
    client_secret: string;
    is_revoked: boolean;
    revoke_datetime?: string;
};

