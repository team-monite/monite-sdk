/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';
import { TagsResponse } from '../models/TagsResponse';
import { TagReadSchema } from '../models/TagReadSchema';
import { TagCreateOrUpdateSchema } from '../models/TagCreateOrUpdateSchema';

export const TAGS_ENDPOINT = 'tags';

export default class TagService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get Tags
   * A list of Tags.
   */
  public getList(): CancelablePromise<TagsResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${TAGS_ENDPOINT}`,
        query: {},
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }

  /**
   * Create Tag
   * @param body
   * @returns TagReadSchema Successful Response
   * @throws ApiError
   */
  public create(
    body: TagCreateOrUpdateSchema
  ): CancelablePromise<TagReadSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${TAGS_ENDPOINT}`,
        query: {},
        body,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }
}
