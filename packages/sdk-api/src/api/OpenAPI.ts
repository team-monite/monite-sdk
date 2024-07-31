import { MoniteFetchToken } from '../moniteSDK.types';
import { ApiError } from './ApiError';
import type { ApiRequestOptions } from './ApiRequestOptions';
import { AccessTokenResponse } from './models/AccessTokenResponse';

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

export interface OpenAPIConfig {
  BASE: string;
  WITH_CREDENTIALS: boolean;
  CREDENTIALS: 'include' | 'omit' | 'same-origin';
  fetchToken: MoniteFetchToken;
  token: string | undefined;
  USERNAME?: string | Resolver<string>;
  PASSWORD?: string | Resolver<string>;
  HEADERS?: Headers | Resolver<Headers>;
  ENCODE_PATH?: (path: string) => string;
}

enum AccessTokenStatus {
  /** Access token is valid and can be used */
  Valid = 'valid',

  /** Access token is not valid and should be fetched */
  Stalled = 'stalled',

  /** Access token is being fetched */
  Fetching = 'fetching',
}

export class OpenAPI {
  public readonly config: OpenAPIConfig;

  /**
   * Access token status contains current status of the access token
   * It can be:
   *  - `valid` - token is valid and can be used
   *  - `stalled` - token is not valid and should be fetched
   *  - `fetching` - token is being fetched
   *  - `undefined` - token is not fetched yet
   *
   * @private
   */
  private accessTokenStatus: AccessTokenStatus;

  /**
   * Access token contains access token, and it's expiration date
   * It's a promise because we have to fetch token first
   *  and then return it.
   * It's `undefined` if token is not fetched yet
   *
   * @private
   */
  private accessTokenPromise: Promise<AccessTokenResponse> | undefined;

  /**
   * Get or fetch access token
   * Make request provided `fetchToken` function from the customer
   *  and saves it to the `accessToken` property
   * Returns token immediately if it's already fetched
   * Doesn't fetch token if it's already fetching
   *
   * @param {boolean} [invalidate] If `true` we have to re-fetch token no matter what
   *
   * @returns {Promise<AccessTokenResponse>} Authentication token
   */
  public async getOrFetchToken(
    invalidate = false
  ): Promise<AccessTokenResponse> {
    if (invalidate && this.accessTokenStatus !== AccessTokenStatus.Fetching) {
      this.accessTokenPromise = undefined;
    }

    /**
     * If access token is already fetched we shouldn't refetch it again.
     * Just return existing ones
     *
     * @todo: We should handle token expiration here
     */
    if (
      this.accessTokenPromise &&
      this.accessTokenStatus !== AccessTokenStatus.Stalled
    ) {
      /**
       * We could return `accessToken` even if the status
       *  is `Fetching` because `accessToken` is a promise
       */
      return this.accessTokenPromise;
    }

    this.accessTokenStatus = AccessTokenStatus.Fetching;

    try {
      this.accessTokenPromise = this.config.fetchToken();

      const token = await this.accessTokenPromise;
      this.accessTokenStatus = AccessTokenStatus.Valid;

      return token;
    } catch (error) {
      this.accessTokenStatus = AccessTokenStatus.Stalled;
      throw error;
    }
  }

  constructor(config: OpenAPIConfig) {
    this.config = config;

    if (config.token) {
      this.accessTokenStatus = AccessTokenStatus.Valid;
    } else {
      this.accessTokenStatus = AccessTokenStatus.Stalled;
    }
  }
}
