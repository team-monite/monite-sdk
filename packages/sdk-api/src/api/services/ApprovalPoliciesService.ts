import type { CancelablePromise } from '../CancelablePromise';
import { ApprovalPolicyCreate } from '../models/ApprovalPolicyCreate';
import { ApprovalPolicyCursorFields } from '../models/ApprovalPolicyCursorFields';
import { ApprovalPolicyResource } from '../models/ApprovalPolicyResource';
import { ApprovalPolicyResourceList } from '../models/ApprovalPolicyResourceList';
import { ApprovalPolicyStatus } from '../models/ApprovalPolicyStatus';
import { ApprovalPolicyUpdate } from '../models/ApprovalPolicyUpdate';
import { OrderEnum } from '../models/OrderEnum';
import { request } from '../request';
import { CommonService } from './CommonService';

export const APPROVAL_POLICIES_ENDPOINT = '/approval_policies';

export interface ApprovalPoliciesGetAllRequest {
  order?: OrderEnum;
  limit?: number;
  paginationToken?: string;
  sort?: ApprovalPolicyCursorFields;
  status?: ApprovalPolicyStatus;

  /**
   * A filter of substring of the approval policy name.
   * Non-case-sensitive.
   */
  name__ncontains?: string;

  /**
   * A filter of who created the approval policy.
   * Supports only one value.
   */
  created_by?: string;

  /**
   * A filter from which date the approval policy was created.
   * `gt` - greater than
   */
  created_at__gt?: string;

  /**
   * A filter from which date the approval policy was created.
   * `lt` - lower than
   */
  created_at__lt?: string;

  /**
   * A filter from which date the approval policy was created.
   * `gte` - greater than or equal
   */
  created_at__gte?: string;

  /**
   * A filter from which date the approval policy was created.
   * `lte` - lower than or equal
   */
  created_at__lte?: string;
}

export class ApprovalPoliciesService extends CommonService {
  /**
   * Retrieve a list of all approval policies with pagination.
   *
   * @link {@see https://docs.monite.com/reference/get_approval_policies} An API reference for this method
   *
   * @returns {ApprovalPolicyResourceList} Successful response
   * @throws ApiError
   */
  public getAll(
    params: ApprovalPoliciesGetAllRequest
  ): CancelablePromise<ApprovalPolicyResourceList> {
    return request(
      {
        method: 'GET',
        url: APPROVAL_POLICIES_ENDPOINT,
        query: {
          limit: 100,
          ...params,
        },
        errors: {
          400: 'Bad Request',
          401: 'Unauthorized',
          403: 'Forbidden',
          405: 'Method Not Allowed',
          406: 'Not Acceptable',
          422: 'Validation Error',
          500: 'Internal Server Error',
        },
      },
      this.openApi
    );
  }

  /**
   * Retrieve a single approval policy by ID.
   *
   * @link {@see https://docs.monite.com/reference/get_approval_policies_id} An API reference for this method
   *
   * @returns {ApprovalPolicyResource} Successful response
   * @throws ApiError
   */
  public getById(
    approvalPolicyId: string
  ): CancelablePromise<ApprovalPolicyResource> {
    return request(
      {
        method: 'GET',
        url: `${APPROVAL_POLICIES_ENDPOINT}/${approvalPolicyId}`,
        errors: {
          400: 'Bad Request',
          401: 'Unauthorized',
          403: 'Forbidden',
          405: 'Method Not Allowed',
          406: 'Not Acceptable',
          409: 'Business logic error',
          422: 'Validation Error',
          500: 'Internal Server Error',
        },
      },
      this.openApi
    );
  }

  /**
   * Create a new approval policy.
   *
   * @link {@see https://docs.monite.com/reference/post_approval_policies} An API reference for this method
   *
   * @returns {ApprovalPolicyResource} Successful response
   * @throws ApiError
   */
  public create(
    body: ApprovalPolicyCreate
  ): CancelablePromise<ApprovalPolicyResource> {
    return request(
      {
        method: 'POST',
        url: APPROVAL_POLICIES_ENDPOINT,
        body,
        errors: {
          400: 'Bad Request',
          401: 'Unauthorized',
          403: 'Forbidden',
          405: 'Method Not Allowed',
          406: 'Not Acceptable',
          409: 'Business logic error',
          422: 'Validation Error',
          500: 'Internal Server Error',
        },
      },
      this.openApi
    );
  }

  /**
   * Update an existing approval policy.
   *
   * @link {@see https://docs.monite.com/reference/patch_approval_policies_id} An API reference for this method
   *
   * @returns {ApprovalPolicyResource} Successful response
   * @throws ApiError
   */
  public update(
    approvalPolicyId: string,
    body: ApprovalPolicyUpdate
  ): CancelablePromise<ApprovalPolicyResource> {
    return request(
      {
        method: 'PATCH',
        url: `${APPROVAL_POLICIES_ENDPOINT}/${approvalPolicyId}`,
        body,
        errors: {
          400: 'Bad Request',
          401: 'Unauthorized',
          403: 'Forbidden',
          405: 'Method Not Allowed',
          406: 'Not Acceptable',
          409: 'Business logic error',
          422: 'Validation Error',
          500: 'Internal Server Error',
        },
      },
      this.openApi
    );
  }
}
