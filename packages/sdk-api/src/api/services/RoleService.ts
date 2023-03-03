import type { RoleCursorFields } from '../models/RoleCursorFields';
import type { CurrencyEnum } from '../models/CurrencyEnum';
import type { OrderEnum } from '../models/OrderEnum';
import type { RoleResponse } from '../models/RoleResponse';
import type { PayableStateEnum } from '../models/PayableStateEnum';

import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';

export default class RoleService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get Role
   * Lists all roles from the connected entity.
   * @param order Order by
   * @param limit Max is 100
   * @param paginationToken A token, obtained from previous page. Prior over other filters
   * @param sort Allowed sort fields
   * @param createdAt
   * @param createdAtGt
   * @param createdAtLt
   * @param createdAtGte
   * @param createdAtLte
   * @param status
   * @param amount
   * @param amountGt
   * @param amountLt
   * @param amountGte
   * @param amountLte
   * @param currency
   * @param counterpartName
   * @param dueDate
   * @param dueDateGt
   * @param dueDateLt
   * @param dueDateGte
   * @param dueDateLte
   * @returns RoleResponse Successful Response
   * @throws ApiError
   */
  public getList(
    order?: OrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: RoleCursorFields,
    createdAt?: string,
    createdAtGt?: string,
    createdAtLt?: string,
    createdAtGte?: string,
    createdAtLte?: string,
    status?: PayableStateEnum,
    amount?: number,
    amountGt?: number,
    amountLt?: number,
    amountGte?: number,
    amountLte?: number,
    currency?: CurrencyEnum,
    counterpartName?: string,
    dueDate?: string,
    dueDateGt?: string,
    dueDateLt?: string,
    dueDateGte?: string,
    dueDateLte?: string
  ): CancelablePromise<RoleResponse> {
    return __request(
      {
        method: 'GET',
        url: '/roles',
        query: {
          order: order,
          limit: limit,
          pagination_token: paginationToken,
          sort: sort,
          created_at: createdAt,
          created_at__gt: createdAtGt,
          created_at__lt: createdAtLt,
          created_at__gte: createdAtGte,
          created_at__lte: createdAtLte,
          status: status,
          amount: amount,
          amount__gt: amountGt,
          amount__lt: amountLt,
          amount__gte: amountGte,
          amount__lte: amountLte,
          currency: currency,
          counterpart_name: counterpartName,
          due_date: dueDate,
          due_date__gt: dueDateGt,
          due_date__lt: dueDateLt,
          due_date__gte: dueDateGte,
          due_date__lte: dueDateLte,
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
