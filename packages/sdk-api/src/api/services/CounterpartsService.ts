/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CounterpartContactResponse } from '../models/CounterpartContactResponse';
import type { CounterpartCreatePayload } from '../models/CounterpartCreatePayload';
import type { CounterpartResponse } from '../models/CounterpartResponse';
import type { CounterpartPaginationResponse } from '../models/CounterpartPaginationResponse';
import type { OrderEnum } from '../models/OrderEnum';
import type { Receivablesapi__v1__counterparts__pagination__CursorFields } from '../models/Receivablesapi__v1__counterparts__pagination__CursorFields';
import type { ReceivablesCounterpartType } from '../models/ReceivablesCounterpartType';

import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';

export default class CounterpartsService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get Counterparts
   * @param xMoniteEntityId monite entity_id
   * @param iban The IBAN of the entity’s bank account.
   * @param order Order by
   * @param limit Max is 100
   * @param paginationToken A token, obtained from previous page. Prior over other filters
   * @param sort Allowed sort fields
   * @param type
   * @param counterpartName
   * @param counterpartNameContains
   * @param counterpartNameIcontains
   * @param isVendor
   * @param isCustomer
   * @param email
   * @param emailContains
   * @param emailIcontains
   * @param createdAt
   * @param createdAtGt
   * @param createdAtLt
   * @param createdAtGte
   * @param createdAtLte
   * @returns ReceivablesCounterpartReceivablesPaginationResponse Successful Response
   * @throws ApiError
   */
  public getList(
    xMoniteEntityId: string,
    iban?: string,
    order?: OrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: Receivablesapi__v1__counterparts__pagination__CursorFields,
    type?: ReceivablesCounterpartType,
    counterpartName?: string,
    counterpartNameContains?: string,
    counterpartNameIcontains?: string,
    isVendor?: boolean,
    isCustomer?: boolean,
    email?: string,
    emailContains?: string,
    emailIcontains?: string,
    createdAt?: string,
    createdAtGt?: string,
    createdAtLt?: string,
    createdAtGte?: string,
    createdAtLte?: string
  ): CancelablePromise<CounterpartPaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: '/counterparts',
        headers: {
          'x-monite-entity-id': xMoniteEntityId,
        },
        query: {
          iban: iban,
          order: order,
          limit: limit,
          pagination_token: paginationToken,
          sort: sort,
          type: type,
          counterpart_name: counterpartName,
          counterpart_name__contains: counterpartNameContains,
          counterpart_name__icontains: counterpartNameIcontains,
          is_vendor: isVendor,
          is_customer: isCustomer,
          email: email,
          email__contains: emailContains,
          email__icontains: emailIcontains,
          created_at: createdAt,
          created_at__gt: createdAtGt,
          created_at__lt: createdAtLt,
          created_at__gte: createdAtGte,
          created_at__lte: createdAtLte,
        },
        errors: {
          404: `Not found`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }

  /**
   * Create a counterpart
   * This endpoint creates a new counterpart.
   * @param requestBody
   * @returns CounterpartResponse Successful Response
   * @throws ApiError
   */
  public create(
    requestBody: CounterpartCreatePayload
  ): CancelablePromise<CounterpartResponse> {
    return __request(
      {
        method: 'POST',
        url: '/counterparts',
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }

  /**
   * Get Counterpart Contacts
   * get counterpart contacts
   * @returns CounterpartContactResponse Successful Response
   * @throws ApiError
   */
  public getCounterpartContacts(
    counterpartId: string
  ): CancelablePromise<Array<CounterpartContactResponse>> {
    return __request(
      {
        method: 'GET',
        url: `/counterparts/${counterpartId}/contacts`,
        errors: {
          404: `Not found`,
          405: `Method Not Allowed`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }

  public getCounterpartById(
    counterpartId: string
  ): CancelablePromise<Array<CounterpartResponse>> {
    return __request(
      {
        method: 'GET',
        url: `/counterparts/${counterpartId}`,
        errors: {
          404: `Not found`,
          405: `Method Not Allowed`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }
}
