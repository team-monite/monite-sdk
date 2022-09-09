/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';
import { EntityUserResponse } from '../models/EntityUserResponse';

export default class EntityUserService {
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
  public getById(id: string): CancelablePromise<EntityUserResponse> {
    return __request(
      {
        method: 'GET',
        url: `/entity_users/${id}`,
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
