import type { ObjectType } from '../models/ObjectType';
import type { WorkflowsPaginationResponse } from '../models/WorkflowsPaginationResponse';

import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';
import { ActionEnum, OrderEnum, WorkflowCursorFields } from '../../api';

export const WORKFLOWS_ENDPOINT = 'workflows';

export default class WorkflowsService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Read Workflows
   * Get workflows
   * @param order Sort order: `asc` (ascending) or `desc` (descending).
   * @param limit The maximum number of results to return per page.
   * @param paginationToken The pagination token to access the next or previous page of results. If `pagination_token` is specified, the `sort`, `order`, and filtering parameters are ignored.
   * @param sort The field by which the results will be sorted.
   * @param objectType
   * @param action
   * @param policyName
   * @param policyNameContains
   * @param policyNameIcontains
   * @param createdBy
   * @param createdAtGt
   * @param createdAtLt
   * @param createdAtGte
   * @param createdAtLte
   * @param updatedAt
   * @param updatedAtGt
   * @param updatedAtLt
   * @param updatedAtGte
   * @param updatedAtLte
   * @returns WorkflowsPaginationResponse Successful Response
   * @throws ApiError
   */
  public getList(
    order?: OrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: WorkflowCursorFields,
    objectType?: ObjectType,
    action?: ActionEnum,
    policyName?: string,
    policyNameContains?: string,
    policyNameIcontains?: string,
    createdBy?: string,
    createdAtGt?: string,
    createdAtLt?: string,
    createdAtGte?: string,
    createdAtLte?: string,
    updatedAt?: string,
    updatedAtGt?: string,
    updatedAtLt?: string,
    updatedAtGte?: string,
    updatedAtLte?: string
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
          action: action,
          policy_name: policyName,
          policy_name__contains: policyNameContains,
          policy_name__icontains: policyNameIcontains,
          created_by: createdBy,
          created_at__gt: createdAtGt,
          created_at__lt: createdAtLt,
          created_at__gte: createdAtGte,
          created_at__lte: createdAtLte,
          updated_at: updatedAt,
          updated_at__gt: updatedAtGt,
          updated_at__lt: updatedAtLt,
          updated_at__gte: updatedAtGte,
          updated_at__lte: updatedAtLte,
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
