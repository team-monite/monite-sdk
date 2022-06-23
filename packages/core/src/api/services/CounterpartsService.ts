/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CounterpartBankAccount } from '../models/CounterpartBankAccount';
import type { CounterpartBankAccountResponse } from '../models/CounterpartBankAccountResponse';
import type { CounterpartContactResponse } from '../models/CounterpartContactResponse';
import type { CounterpartCreatePayload } from '../models/CounterpartCreatePayload';
import type { CounterpartResponse } from '../models/CounterpartResponse';
import type { CounterpartUpdatePayload } from '../models/CounterpartUpdatePayload';
import type { CreateCounterpartContactPayload } from '../models/CreateCounterpartContactPayload';
import type { UpdateCounterpartContactPayload } from '../models/UpdateCounterpartContactPayload';

import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPI, OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';

export default class CounterpartsService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get all counterparts
   * This endpoint lists all counterparts sorted by creation date, with the most recently created counterparts appearing first.
   * @returns CounterpartResponse Successful Response
   * @throws ApiError
   */
  public getList(): CancelablePromise<Array<CounterpartResponse>> {
    return __request(
      {
        method: 'GET',
        url: '/counterparts',
        errors: {
          404: `Not found`,
          405: `Method Not Allowed`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }

  /**
   * Create a counterpart
   * This endpoint creates a new counterpart.
   * @param requestBody
   * @returns CounterpartResponse Successful Response
   * @throws ApiError
   */
  public create(
    requestBody: CounterpartCreatePayload
  ): CancelablePromise<CounterpartResponse> {
    return __request(
      {
        method: 'POST',
        url: '/counterparts',
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }

  /**
   * Get Counterpart Contacts
   * get counterpart contacts
   * @returns CounterpartContactResponse Successful Response
   * @throws ApiError
   */
  public getCounterpartContacts(
    counterpartId: string
  ): CancelablePromise<Array<CounterpartContactResponse>> {
    return __request(
      {
        method: 'GET',
        url: `/counterparts/${counterpartId}/contacts`,
        errors: {
          404: `Not found`,
          405: `Method Not Allowed`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }
}
