/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { api__v1__workflows__pagination__CursorFields } from '../models/api__v1__workflows__pagination__CursorFields';
import type { ObjectType } from '../models/ObjectType';
import type { OrderEnum } from '../models/OrderEnum';
import type { StatusEnum } from '../models/StatusEnum';
import type { WorkflowsPaginationResponse } from '../models/WorkflowsPaginationResponse';

import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';

export default class WorkflowsService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Read Workflows
   * Get workflows
   * @param order Order by
   * @param limit Max is 100
   * @param paginationToken A token, obtained from previous page. Prior over other filters
   * @param sort Allowed sort fields
   * @param objectType
   * @param policyName
   * @param status
   * @param createdBy
   * @param createdAt
   * @param createdAtGt
   * @param createdAtLt
   * @param createdAtGte
   * @param createdAtLte
   * @returns WorkflowsPaginationResponse Successful Response
   * @throws ApiError
   */
  public getList(
    order?: OrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: api__v1__workflows__pagination__CursorFields,
    objectType?: ObjectType,
    policyName?: string,
    status?: StatusEnum,
    createdBy?: string,
    createdAt?: string,
    createdAtGt?: string,
    createdAtLt?: string,
    createdAtGte?: string,
    createdAtLte?: string
  ): CancelablePromise<WorkflowsPaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: '/workflows',
        query: {
          order: order,
          limit: limit,
          pagination_token: paginationToken,
          sort: sort,
          object_type: objectType,
          policy_name: policyName,
          status: status,
          created_by: createdBy,
          created_at: createdAt,
          created_at__gt: createdAtGt,
          created_at__lt: createdAtLt,
          created_at__gte: createdAtGte,
          created_at__lte: createdAtLte,
        },
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
