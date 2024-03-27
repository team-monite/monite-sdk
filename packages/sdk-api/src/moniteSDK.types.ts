import { AccessTokenResponse } from './api';

/**
 * The function that will be called to fetch the access token.
 * The API ID and secret need to be exchanged for an access token
 *  which is then used to authenticate the API calls.
 * To do this, call POST /auth/token with the following request body
 *
 * ## Example
 * ```json
 * {
 *   "grant_type": "client_credentials",
 *   "client_id": "YOUR_PARTNER_ID",
 *   "client_secret": "YOUR_PARTNER_SECRET"
 * }
 * ```
 */
export type MoniteFetchToken = () => Promise<AccessTokenResponse>;

/** Describes all possible ApiUrl options */
export type MoniteApiUrl =
  | 'https://api.sandbox.monite.com/v1'
  | 'https://api.monite.com/v1'
  | string;
