/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { api__v1__payables__pagination__CursorFields } from '../models/api__v1__payables__pagination__CursorFields';
import type { CurrencyEnum } from '../models/CurrencyEnum';
import type { OrderEnum } from '../models/OrderEnum';
import type { PaginationResponse } from '../models/PaginationResponse';
import type { PayableStateEnum } from '../models/PayableStateEnum';

import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';
import { PayableResponseSchema } from '../models/PayableResponseSchema';

export default class PayablesService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get Payables
   * Lists all payables from the connected entity.
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
   * @returns PaginationResponse Successful Response
   * @throws ApiError
   */
  public getList(
    order?: OrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: api__v1__payables__pagination__CursorFields,
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
  ): CancelablePromise<PaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: '/payables',
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

  /**
   * Get Payable by ID
   * Payable from the connected entity.
   * @param id
   * @returns PayableResponseSchema Successful Response
   * @throws ApiError
   */
  public getById(id: string): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'GET',
        url: '/payables',
        query: {
          id,
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
