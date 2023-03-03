/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessTokenResponse } from '../models/AccessTokenResponse';
import type { CreateEntityRequest } from '../models/CreateEntityRequest';
import type { CreateEntityUserRequest } from '../models/CreateEntityUserRequest';
import type { CreateRoleRequest } from '../models/CreateRoleRequest';
import type { EntityPaginationResponse } from '../models/EntityPaginationResponse';
import type { EntityResponse } from '../models/EntityResponse';
import type { EntityTypeEnum } from '../models/EntityTypeEnum';
import type { EntityUserPaginationResponse } from '../models/EntityUserPaginationResponse';
import type { EntityUserResponse } from '../models/EntityUserResponse';
import type { MessageResponse } from '../models/MessageResponse';
import type { ObtainTokenPayload } from '../models/ObtainTokenPayload';
import type { OrderEnum } from '../models/OrderEnum';
import type { PartnerProjectSettingsPayload } from '../models/PartnerProjectSettingsPayload';
import type { PartnerProjectSettingsResponse } from '../models/PartnerProjectSettingsResponse';
import type { PatchSettingsPayload } from '../models/PatchSettingsPayload';
import type { RevokeTokenPayload } from '../models/RevokeTokenPayload';
import type { RolePaginationResponse } from '../models/RolePaginationResponse';
import type { RoleResponse } from '../models/RoleResponse';
import type { SearchEntitiesPayload } from '../models/SearchEntitiesPayload';
import type { SearchRolesPayload } from '../models/SearchRolesPayload';
import type { SettingsResponse } from '../models/SettingsResponse';
import type { UpdateEntityRequest } from '../models/UpdateEntityRequest';
import type { UpdateEntityUserRequest } from '../models/UpdateEntityUserRequest';
import type { UpdateRoleRequest } from '../models/UpdateRoleRequest';

import type { CancelablePromise } from '../CancelablePromise';
import { OpenAPI } from '../OpenAPI';
import { request as __request } from '../request';
import { OpenAPIConfig } from '../OpenAPI';

export default class AuthNSettingsService {
  openapiConfig: Partial<OpenAPIConfig>;

  constructor({ config }: { config: Partial<OpenAPIConfig> }) {
    this.openapiConfig = config;
  }

  /**
   * Revoke Token
   * @param xRequestId Id of a request. Helps to trace logs
   * @param xServiceName Client name. Helps to trace logs
   * @param requestBody
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  // public static revokeTokenV1AuthRevokePost(
  //   xRequestId: string,
  //   xServiceName: string,
  //   requestBody: RevokeTokenPayload
  // ): CancelablePromise<MessageResponse> {
  //   return __request(OpenAPI, {
  //     method: 'POST',
  //     url: '/auth/revoke',
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //     },
  //     body: requestBody,
  //     mediaType: 'application/json',
  //     errors: {
  //       400: `Bad Request`,
  //       401: `Unauthorized`,
  //       403: `Forbidden`,
  //       404: `Not found`,
  //       405: `Method Not Allowed`,
  //       406: `Not Acceptable`,
  //       409: `Biz logic error`,
  //       416: `Requested Range Not Satisfiable`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }

  /**
   * Obtain New Token
   * @param requestBody
   * @returns AccessTokenResponse Successful Response
   * @throws ApiError
   */
  public getAuthToken(
    requestBody: ObtainTokenPayload
  ): CancelablePromise<AccessTokenResponse> {
    return __request(
      {
        method: 'POST',
        url: '/auth/token',
        headers: {},
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          401: `Unauthorized`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openapiConfig
    );
  }

  // /**
  //  * Get Entities
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param order Order by
  //  * @param limit Max is 100
  //  * @param paginationToken A token, obtained from previous page. Prior over other filters
  //  * @param sort Allowed sort fields
  //  * @param name
  //  * @param internalId
  //  * @param type
  //  * @param createdAt
  //  * @param createdAtGt
  //  * @param createdAtLt
  //  * @param createdAtGte
  //  * @param createdAtLte
  //  * @returns EntityPaginationResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static getEntitiesV1EntitiesGet(
  //   xRequestId: string,
  //   xServiceName: string,
  //   order?: OrderEnum,
  //   limit: number = 100,
  //   paginationToken?: string,
  //   sort?: api__v1__entities__pagination__CursorFields,
  //   name?: string,
  //   internalId?: string,
  //   type?: EntityTypeEnum,
  //   createdAt?: string,
  //   createdAtGt?: string,
  //   createdAtLt?: string,
  //   createdAtGte?: string,
  //   createdAtLte?: string
  // ): CancelablePromise<EntityPaginationResponse> {
  //   return __request(OpenAPI, {
  //     method: 'GET',
  //     url: '/entities',
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //     },
  //     query: {
  //       order: order,
  //       limit: limit,
  //       pagination_token: paginationToken,
  //       sort: sort,
  //       name: name,
  //       internal_id: internalId,
  //       type: type,
  //       created_at: createdAt,
  //       created_at__gt: createdAtGt,
  //       created_at__lt: createdAtLt,
  //       created_at__gte: createdAtGte,
  //       created_at__lte: createdAtLte,
  //     },
  //     errors: {
  //       400: `Bad Request`,
  //       401: `Unauthorized`,
  //       403: `Forbidden`,
  //       405: `Method Not Allowed`,
  //       406: `Not Acceptable`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Create Entity
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param requestBody
  //  * @returns EntityResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static createEntityV1EntitiesPost(
  //   xRequestId: string,
  //   xServiceName: string,
  //   requestBody: CreateEntityRequest
  // ): CancelablePromise<EntityResponse> {
  //   return __request(OpenAPI, {
  //     method: 'POST',
  //     url: '/entities',
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //     },
  //     body: requestBody,
  //     mediaType: 'application/json',
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Get Entity By Id
  //  * @param entityId
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @returns EntityResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static getEntityByIdV1EntitiesEntityIdGet(
  //   entityId: string,
  //   xRequestId: string,
  //   xServiceName: string
  // ): CancelablePromise<EntityResponse> {
  //   return __request(OpenAPI, {
  //     method: 'GET',
  //     url: '/entities/{entity_id}',
  //     path: {
  //       entity_id: entityId,
  //     },
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //     },
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Update Entity By Id
  //  * @param entityId
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param requestBody
  //  * @returns EntityResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static updateEntityByIdV1EntitiesEntityIdPatch(
  //   entityId: string,
  //   xRequestId: string,
  //   xServiceName: string,
  //   requestBody: UpdateEntityRequest
  // ): CancelablePromise<EntityResponse> {
  //   return __request(OpenAPI, {
  //     method: 'PATCH',
  //     url: '/entities/{entity_id}',
  //     path: {
  //       entity_id: entityId,
  //     },
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //     },
  //     body: requestBody,
  //     mediaType: 'application/json',
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Get Entity Settings
  //  * @param entityId
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @returns SettingsResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static getEntitySettingsV1EntitiesEntityIdSettingsGet(
  //   entityId: string,
  //   xRequestId: string,
  //   xServiceName: string
  // ): CancelablePromise<SettingsResponse> {
  //   return __request(OpenAPI, {
  //     method: 'GET',
  //     url: '/entities/{entity_id}/settings',
  //     path: {
  //       entity_id: entityId,
  //     },
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //     },
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Patch Entity Settings
  //  * @param entityId
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param requestBody
  //  * @returns SettingsResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static patchEntitySettingsV1EntitiesEntityIdSettingsPatch(
  //   entityId: string,
  //   xRequestId: string,
  //   xServiceName: string,
  //   requestBody: PatchSettingsPayload
  // ): CancelablePromise<SettingsResponse> {
  //   return __request(OpenAPI, {
  //     method: 'PATCH',
  //     url: '/entities/{entity_id}/settings',
  //     path: {
  //       entity_id: entityId,
  //     },
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //     },
  //     body: requestBody,
  //     mediaType: 'application/json',
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Get Entity Users
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param xMoniteEntityId monite entity_id
  //  * @param order Order by
  //  * @param limit Max is 100
  //  * @param paginationToken A token, obtained from previous page. Prior over other filters
  //  * @param sort Allowed sort fields
  //  * @param firstName
  //  * @param createdAt
  //  * @param createdAtGt
  //  * @param createdAtLt
  //  * @param createdAtGte
  //  * @param createdAtLte
  //  * @returns EntityUserPaginationResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static getEntityUsersV1EntityUsersGet(
  //   xRequestId: string,
  //   xServiceName: string,
  //   xMoniteEntityId: string,
  //   order?: OrderEnum,
  //   limit: number = 100,
  //   paginationToken?: string,
  //   sort?: api__v1__entity_users__pagination__CursorFields,
  //   firstName?: string,
  //   createdAt?: string,
  //   createdAtGt?: string,
  //   createdAtLt?: string,
  //   createdAtGte?: string,
  //   createdAtLte?: string
  // ): CancelablePromise<EntityUserPaginationResponse> {
  //   return __request(OpenAPI, {
  //     method: 'GET',
  //     url: '/entity_users',
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //       'x-monite-entity-id': xMoniteEntityId,
  //     },
  //     query: {
  //       order: order,
  //       limit: limit,
  //       pagination_token: paginationToken,
  //       sort: sort,
  //       first_name: firstName,
  //       created_at: createdAt,
  //       created_at__gt: createdAtGt,
  //       created_at__lt: createdAtLt,
  //       created_at__gte: createdAtGte,
  //       created_at__lte: createdAtLte,
  //     },
  //     errors: {
  //       400: `Bad Request`,
  //       401: `Unauthorized`,
  //       403: `Forbidden`,
  //       405: `Method Not Allowed`,
  //       406: `Not Acceptable`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Create Entity User
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param xMoniteEntityId monite entity_id
  //  * @param requestBody
  //  * @returns EntityUserResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static createEntityUserV1EntityUsersPost(
  //   xRequestId: string,
  //   xServiceName: string,
  //   xMoniteEntityId: string,
  //   requestBody: CreateEntityUserRequest
  // ): CancelablePromise<EntityUserResponse> {
  //   return __request(OpenAPI, {
  //     method: 'POST',
  //     url: '/entity_users',
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //       'x-monite-entity-id': xMoniteEntityId,
  //     },
  //     body: requestBody,
  //     mediaType: 'application/json',
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Search Entity User
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param requestBody
  //  * @returns EntityUserResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static searchEntityUserV1EntityUsersSearchPost(
  //   xRequestId: string,
  //   xServiceName: string,
  //   requestBody: SearchEntitiesPayload
  // ): CancelablePromise<Array<EntityUserResponse>> {
  //   return __request(OpenAPI, {
  //     method: 'POST',
  //     url: '/entity_users/search',
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //     },
  //     body: requestBody,
  //     mediaType: 'application/json',
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Get Entity User By Id
  //  * @param entityUserId
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param xMoniteEntityId monite entity_id
  //  * @returns EntityUserResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static getEntityUserByIdV1EntityUsersEntityUserIdGet(
  //   entityUserId: string,
  //   xRequestId: string,
  //   xServiceName: string,
  //   xMoniteEntityId: string
  // ): CancelablePromise<EntityUserResponse> {
  //   return __request(OpenAPI, {
  //     method: 'GET',
  //     url: '/entity_users/{entity_user_id}',
  //     path: {
  //       entity_user_id: entityUserId,
  //     },
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //       'x-monite-entity-id': xMoniteEntityId,
  //     },
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Update Entity User By Id
  //  * @param entityUserId
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param xMoniteEntityId monite entity_id
  //  * @param requestBody
  //  * @returns EntityUserResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static updateEntityUserByIdV1EntityUsersEntityUserIdPatch(
  //   entityUserId: string,
  //   xRequestId: string,
  //   xServiceName: string,
  //   xMoniteEntityId: string,
  //   requestBody: UpdateEntityUserRequest
  // ): CancelablePromise<EntityUserResponse> {
  //   return __request(OpenAPI, {
  //     method: 'PATCH',
  //     url: '/entity_users/{entity_user_id}',
  //     path: {
  //       entity_user_id: entityUserId,
  //     },
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //       'x-monite-entity-id': xMoniteEntityId,
  //     },
  //     body: requestBody,
  //     mediaType: 'application/json',
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Get Roles
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param xMoniteEntityId monite entity_id
  //  * @param order Order by
  //  * @param limit Max is 100
  //  * @param paginationToken A token, obtained from previous page. Prior over other filters
  //  * @param sort Allowed sort fields
  //  * @param name
  //  * @param createdAt
  //  * @param createdAtGt
  //  * @param createdAtLt
  //  * @param createdAtGte
  //  * @param createdAtLte
  //  * @returns RolePaginationResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static getRolesV1RolesGet(
  //   xRequestId: string,
  //   xServiceName: string,
  //   xMoniteEntityId: string,
  //   order?: OrderEnum,
  //   limit: number = 100,
  //   paginationToken?: string,
  //   sort?: api__v1__roles__pagination__CursorFields,
  //   name?: string,
  //   createdAt?: string,
  //   createdAtGt?: string,
  //   createdAtLt?: string,
  //   createdAtGte?: string,
  //   createdAtLte?: string
  // ): CancelablePromise<RolePaginationResponse> {
  //   return __request(OpenAPI, {
  //     method: 'GET',
  //     url: '/roles',
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //       'x-monite-entity-id': xMoniteEntityId,
  //     },
  //     query: {
  //       order: order,
  //       limit: limit,
  //       pagination_token: paginationToken,
  //       sort: sort,
  //       name: name,
  //       created_at: createdAt,
  //       created_at__gt: createdAtGt,
  //       created_at__lt: createdAtLt,
  //       created_at__gte: createdAtGte,
  //       created_at__lte: createdAtLte,
  //     },
  //     errors: {
  //       400: `Bad Request`,
  //       401: `Unauthorized`,
  //       403: `Forbidden`,
  //       405: `Method Not Allowed`,
  //       406: `Not Acceptable`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Create Role
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param xMoniteEntityId monite entity_id
  //  * @param requestBody
  //  * @returns RoleResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static createRoleV1RolesPost(
  //   xRequestId: string,
  //   xServiceName: string,
  //   xMoniteEntityId: string,
  //   requestBody: CreateRoleRequest
  // ): CancelablePromise<RoleResponse> {
  //   return __request(OpenAPI, {
  //     method: 'POST',
  //     url: '/roles',
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //       'x-monite-entity-id': xMoniteEntityId,
  //     },
  //     body: requestBody,
  //     mediaType: 'application/json',
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Search Roles
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param requestBody
  //  * @returns RoleResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static searchRolesV1RolesSearchPost(
  //   xRequestId: string,
  //   xServiceName: string,
  //   requestBody: SearchRolesPayload
  // ): CancelablePromise<Array<RoleResponse>> {
  //   return __request(OpenAPI, {
  //     method: 'POST',
  //     url: '/roles/search',
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //     },
  //     body: requestBody,
  //     mediaType: 'application/json',
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Get Role By Id
  //  * @param roleId
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param xMoniteEntityId monite entity_id
  //  * @returns RoleResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static getRoleByIdV1RolesRoleIdGet(
  //   roleId: string,
  //   xRequestId: string,
  //   xServiceName: string,
  //   xMoniteEntityId: string
  // ): CancelablePromise<RoleResponse> {
  //   return __request(OpenAPI, {
  //     method: 'GET',
  //     url: '/roles/{role_id}',
  //     path: {
  //       role_id: roleId,
  //     },
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //       'x-monite-entity-id': xMoniteEntityId,
  //     },
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Update Role By Id
  //  * @param roleId
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param xMoniteEntityId monite entity_id
  //  * @param requestBody
  //  * @returns RoleResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static updateRoleByIdV1RolesRoleIdPatch(
  //   roleId: string,
  //   xRequestId: string,
  //   xServiceName: string,
  //   xMoniteEntityId: string,
  //   requestBody: UpdateRoleRequest
  // ): CancelablePromise<RoleResponse> {
  //   return __request(OpenAPI, {
  //     method: 'PATCH',
  //     url: '/roles/{role_id}',
  //     path: {
  //       role_id: roleId,
  //     },
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //       'x-monite-entity-id': xMoniteEntityId,
  //     },
  //     body: requestBody,
  //     mediaType: 'application/json',
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Get Partner Project Settings
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @returns PartnerProjectSettingsResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static getPartnerProjectSettingsV1SettingsGet(
  //   xRequestId: string,
  //   xServiceName: string
  // ): CancelablePromise<PartnerProjectSettingsResponse> {
  //   return __request(OpenAPI, {
  //     method: 'GET',
  //     url: '/settings',
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //     },
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
  //
  // /**
  //  * Save Or Replace Partner Project Settings
  //  * @param xRequestId Id of a request. Helps to trace logs
  //  * @param xServiceName Client name. Helps to trace logs
  //  * @param requestBody
  //  * @returns PartnerProjectSettingsResponse Successful Response
  //  * @throws ApiError
  //  */
  // public static saveOrReplacePartnerProjectSettingsV1SettingsPatch(
  //   xRequestId: string,
  //   xServiceName: string,
  //   requestBody: PartnerProjectSettingsPayload
  // ): CancelablePromise<PartnerProjectSettingsResponse> {
  //   return __request(OpenAPI, {
  //     method: 'PATCH',
  //     url: '/settings',
  //     headers: {
  //       'x-request-id': xRequestId,
  //       'x-service-name': xServiceName,
  //     },
  //     body: requestBody,
  //     mediaType: 'application/json',
  //     errors: {
  //       400: `Bad Request`,
  //       405: `Method Not Allowed`,
  //       422: `Validation Error`,
  //       500: `Internal Server Error`,
  //     },
  //   });
  // }
}
