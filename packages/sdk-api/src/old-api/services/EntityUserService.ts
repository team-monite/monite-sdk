import {
  EntityResponse,
  EntityUserCursorFields,
  EntityUserPaginationResponse,
  EntityUserResponse,
  OrderEnum,
  RoleResponse,
  UpdateEntityRequest,
} from '../';
import type { CancelablePromise } from '../CancelablePromise';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export const ENTITY_USERS_ENDPOINT = 'entity_users';

export class EntityUserService extends CommonService {
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
    sort?: EntityUserCursorFields,
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
      this.openApi
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
      this.openApi
    );
  }

  /**
   * Get current entity user by token
   *
   * @returns EntityUserResponse Successful Response
   * @throws ApiError
   */
  public getMe(): CancelablePromise<EntityUserResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${ENTITY_USERS_ENDPOINT}/me`,
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
   * Retrieves information of an entity, which this entity user belongs to.
   *
   * @see {@link https://docs.monite.com/reference/get_entities_me} for API call
   *
   * @returns EntityResponse Successful Response
   * @throws ApiError
   */
  public getMyEntity(): CancelablePromise<EntityResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${ENTITY_USERS_ENDPOINT}/my_entity`,
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

  public updateMyEntity(
    body: UpdateEntityRequest
  ): CancelablePromise<EntityResponse> {
    return __request(
      {
        method: 'PATCH',
        url: `/${ENTITY_USERS_ENDPOINT}/my_entity`,
        body,
        mediaType: 'application/json',
      },
      this.openApi
    );
  }

  /**
   * Retrieves information of an entity user role.
   *
   * @returns RoleResponse Successful Response
   * @throws ApiError
   */
  public getMyRole(): CancelablePromise<RoleResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${ENTITY_USERS_ENDPOINT}/my_role`,
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
}
