/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
// import type { Body_add_entity_user_userpic_info_userpic_put } from '../models/Body_add_entity_user_userpic_info_userpic_put';
import type { EntityUserResponse } from '../models/EntityUserResponse';
import type { FileSchema } from '../models/FileSchema';

import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';

export default class UserInfoService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Read Personal Info
   * Read personal info
   * @returns EntityUserResponse Successful Response
   * @throws ApiError
   */
  public getInfo({
    openapiConfig,
  }: {
    openapiConfig?: Partial<OpenAPIConfig>;
  }): CancelablePromise<EntityUserResponse> {
    return __request(
      {
        method: 'GET',
        url: '/info',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          500: `Internal Server Error`,
        },
      },
      { ...this.openapiConfig, ...openapiConfig }
    );
  }
}
