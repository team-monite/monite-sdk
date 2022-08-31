/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CounterpartContactResponse } from '../models/CounterpartContactResponse';
import type { CounterpartCreatePayload } from '../models/CounterpartCreatePayload';
import type { CounterpartResponse } from '../models/CounterpartResponse';

import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';
import { CounterpartPaginationResponse } from '../models/CounterpartPaginationResponse';

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
  public getList(): CancelablePromise<CounterpartPaginationResponse> {
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

  public getCounterpartById(
    counterpartId: string
  ): CancelablePromise<Array<CounterpartResponse>> {
    return __request(
      {
        method: 'GET',
        url: `/counterparts/${counterpartId}`,
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
