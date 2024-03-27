/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CancelablePromise } from '../CancelablePromise';
import { EntityUserResponse } from '../models/EntityUserResponse';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export class UserInfoService extends CommonService {
  /**
   * Read Personal Info
   * Read personal info
   * @returns EntityUserResponse Successful Response
   * @throws ApiError
   */
  public getInfo(): CancelablePromise<EntityUserResponse> {
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
      this.openApi
    );
  }
}
