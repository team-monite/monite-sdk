import type { CancelablePromise } from '../CancelablePromise';
import type { CurrencyEnum } from '../models/CurrencyEnum';
import type { OrderEnum } from '../models/OrderEnum';
import type { PayableStateEnum } from '../models/PayableStateEnum';
import type { RoleCursorFields } from '../models/RoleCursorFields';
import { RolePaginationResponse } from '../models/RolePaginationResponse';
import type { RoleResponse } from '../models/RoleResponse';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export interface RoleServiceGetListRequestParams {
  order?: OrderEnum;
  limit: number;
  paginationToken?: string;
  sort?: RoleCursorFields;
  idIn?: Array<string>;
  name?: string;
  createdAt?: string;
  createdAtGt?: string;
  createdAtLt?: string;
  createdAtGte?: string;
  createdAtLte?: string;
}

export class RoleService extends CommonService {
  /**
   * Get Role
   *
   * Lists all roles from the connected entity.
   *
   * @see {@link https://docs.monite.com/reference/get_roles} for API call
   *
   * @returns RolePaginationResponse Successful Response
   * @throws ApiError
   */
  public getList(
    params: RoleServiceGetListRequestParams
  ): CancelablePromise<RolePaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: '/roles',
        query: {
          order: params.order,
          limit: params.limit,
          pagination_token: params.paginationToken,
          sort: params.sort,
          id__in: params.idIn,
          name: params.name,
          created_at: params.createdAt,
          created_at__gt: params.createdAtGt,
          created_at__lt: params.createdAtLt,
          created_at__gte: params.createdAtGte,
          created_at__lte: params.createdAtLte,
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
      this.openApi
    );
  }

  /**
   * Get role by id
   *
   * @param roleId Role identifier
   * @returns RoleResponse Succesful Response
   *
   * @throws ApiError
   */
  public getDetail(roleId: string): CancelablePromise<RoleResponse> {
    return __request<RoleResponse>(
      {
        method: 'GET',
        url: `/roles/${roleId}`,
      },
      this.openApi
    );
  }
}
