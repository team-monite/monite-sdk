/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';
import { EntityResponse } from '../models/EntityResponse';

export default class EntityService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get Entity User by ID
   * Entity User from the connected entity.
   * @param id
   * @returns EntityUserResponse Successful Response
   * @throws ApiError
   */
  public getById(id: string): CancelablePromise<EntityResponse> {
    return __request(
      {
        method: 'GET',
        url: `/entities/${id}`,
        // errors: {
        //   400: `Bad Request`,
        //   401: `Unauthorized`,
        //   403: `Forbidden`,
        //   405: `Method Not Allowed`,
        //   406: `Not Acceptable`,
        //   422: `Validation Error`,
        //   500: `Internal Server Error`,
        // },
      },
      this.openapiConfig
    );
  }
}
