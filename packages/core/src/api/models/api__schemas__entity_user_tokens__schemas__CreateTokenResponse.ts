/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type api__schemas__entity_user_tokens__schemas__CreateTokenResponse = {
    /**
     * Bearer token for further API calls
     */
    token: string;
    /**
     * The number of seconds until the access token expires
     */
    expires_in: number;
};
