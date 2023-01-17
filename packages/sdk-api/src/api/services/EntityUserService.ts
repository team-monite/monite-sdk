import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPIConfig } from '../OpenAPI';
import { request as __request } from '../request';
import { EntityUserResponse } from '../models/EntityUserResponse';
import {
  api__v1__entity_users__pagination__CursorFields,
  EntityUserPaginationResponse,
  OrderEnum,
} from '../../api';

export const ENTITY_USERS_ENDPOINT = 'entity_users';

export default class EntityUserService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Get Entity Users
   * @param order Order by
   * @param limit Max is 100
   * @param paginationToken A token, obtained from previous page. Prior over other filters
   * @param sort Allowed sort fields
   * @param firstName
   * @param createdAt
   * @param createdAtGt
   * @param createdAtLt
   * @param createdAtGte
   * @param createdAtLte
   * @returns EntityUserPaginationResponse Successful Response
   * @throws ApiError
   */
  public getList(
    order?: OrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: api__v1__entity_users__pagination__CursorFields,
    firstName?: string,
    createdAt?: string,
    createdAtGt?: string,
    createdAtLt?: string,
    createdAtGte?: string,
    createdAtLte?: string
  ): CancelablePromise<EntityUserPaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${ENTITY_USERS_ENDPOINT}`,
        query: {
          order: order,
          limit: limit,
          pagination_token: paginationToken,
          sort: sort,
          first_name: firstName,
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

  /**
   * Get Entity User by ID
   * Entity User from the connected entity.
   * @param id
   * @returns EntityUserResponse Successful Response
   * @throws ApiError
   */
  public getById(id: string): CancelablePromise<EntityUserResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${ENTITY_USERS_ENDPOINT}/${id}`,
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
