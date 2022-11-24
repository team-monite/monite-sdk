/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { api__v1__payables__pagination__CursorFields } from '../models/api__v1__payables__pagination__CursorFields';
import type { CurrencyEnum } from '../models/CurrencyEnum';
import type { OrderEnum } from '../models/OrderEnum';
import type { PayableStateEnum } from '../models/PayableStateEnum';

import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';
import { PayableResponseSchema } from '../models/PayableResponseSchema';
import { PayableUpdateSchema } from '../models/PayableUpdateSchema';
import { api__schemas__payables__schemas__PaginationResponse } from '../models/api__schemas__payables__schemas__PaginationResponse';

export const PAYABLES_ENDPOINT = 'payables';

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
  ): CancelablePromise<api__schemas__payables__schemas__PaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${PAYABLES_ENDPOINT}`,
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
        url: `/${PAYABLES_ENDPOINT}/${id}`,
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
   * Update Payable By Id
   * @param id
   * @param body
   * @returns PayableResponse Successful Response
   * @throws ApiError
   */
  public update(
    id: string,
    body: PayableUpdateSchema
  ): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'PATCH',
        url: `/${PAYABLES_ENDPOINT}/${id}`,
        body,
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
   * Submit Payable By Id
   * @param payableId
   * @returns PayableResponse Successful Response
   * @throws ApiError
   */
  public submit(payableId: string): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/submit_for_approval`,
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
   * Approve Payable By Id
   * @param payableId
   * @returns PayableResponse Successful Response
   * @throws ApiError
   */
  public approve(payableId: string): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/approve_payment_operation`,
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
   * Reject Payable By Id
   * @param payableId
   * @returns PayableResponse Successful Response
   * @throws ApiError
   */
  public reject(payableId: string): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/reject`,
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
   * Pay Payable By Id
   * @param payableId
   * @returns PayableResponse Successful Response
   * @throws ApiError
   */
  public pay(payableId: string): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/pay`,
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
