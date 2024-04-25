import { delay } from '@/mocks/utils';
import {
  ENTITY_USERS_ENDPOINT,
  EntityUserPaginationResponse,
  EntityUserResponse,
  RoleResponse,
} from '@monite/sdk-api';

import { http, HttpResponse } from 'msw';

import {
  lowPermissionRole,
  readOnlyRole,
  allowedForOwnRole,
  emptyPermissionRole,
  absentPermissionRole,
  fullPermissionRole,
} from '../roles/rolesFixtures';
import {
  entityUserByIdFixture,
  entityUserByIdWithLowPermissionsFixture,
  entityUserByIdWithEmptyPermissionsFixture,
  entityUserByIdWithAbsentPermissionsFixture,
  entityUserByIdWithOwnerPermissionsFixture,
  entityUserByIdWithReadonlyPermissionsFixture,
  entityUsers,
} from './entityUserByIdFixture';
import { entityUsersFixture } from './entityUsersFixture';

/** Provides only `READ` and `UPDATE` access */
export const ENTITY_ID_FOR_LOW_PERMISSIONS = 'low-permissions';
export const ENTITY_ID_FOR_READONLY_PERMISSIONS = 'readonly-permissions';
export const ENTITY_ID_FOR_EMPTY_PERMISSIONS = 'empty-permissions';
export const ENTITY_ID_FOR_ABSENT_PERMISSIONS = 'absent-permissions';

/** All permissions allowed only for the owner */
export const ENTITY_ID_FOR_OWNER_PERMISSIONS = 'owner-permissions';

export const entityUsersHandlers = [
  /**
   * Get entity user by auth token
   */
  http.get<{}, undefined, EntityUserResponse>(
    `*/${ENTITY_USERS_ENDPOINT}/me`,
    async ({ request }) => {
      const entityId = request.headers.get('x-monite-entity-id');
      const entityUserId = request.headers.get('x-monite-entity-user-id');

      if (entityId === ENTITY_ID_FOR_LOW_PERMISSIONS) {
        await delay();

        return HttpResponse.json(entityUserByIdWithLowPermissionsFixture);
      }

      if (entityId === ENTITY_ID_FOR_READONLY_PERMISSIONS) {
        await delay();

        return HttpResponse.json(entityUserByIdWithReadonlyPermissionsFixture);
      }

      if (entityId === ENTITY_ID_FOR_EMPTY_PERMISSIONS) {
        await delay();

        return HttpResponse.json(entityUserByIdWithEmptyPermissionsFixture);
      }

      if (entityId === ENTITY_ID_FOR_ABSENT_PERMISSIONS) {
        await delay();

        return HttpResponse.json(entityUserByIdWithAbsentPermissionsFixture);
      }

      if (entityId === ENTITY_ID_FOR_OWNER_PERMISSIONS) {
        if (!entityUserId) {
          await delay();

          return HttpResponse.json(entityUserByIdWithOwnerPermissionsFixture);
        } else {
          await delay();

          return HttpResponse.json({
            ...entityUserByIdWithOwnerPermissionsFixture,
            id: entityUserId,
          });
        }
      }

      await delay();

      return HttpResponse.json(entityUserByIdFixture);
    }
  ),

  http.get<{}, undefined, RoleResponse>(
    `*/${ENTITY_USERS_ENDPOINT}/my_role`,
    async ({ request }) => {
      const entityId = request.headers.get('x-monite-entity-id');

      if (entityId === ENTITY_ID_FOR_LOW_PERMISSIONS) {
        await delay();

        return HttpResponse.json(lowPermissionRole);
      }

      if (entityId === ENTITY_ID_FOR_READONLY_PERMISSIONS) {
        await delay();

        return HttpResponse.json(readOnlyRole);
      }

      if (entityId === ENTITY_ID_FOR_EMPTY_PERMISSIONS) {
        await delay();

        return HttpResponse.json(emptyPermissionRole);
      }

      if (entityId === ENTITY_ID_FOR_ABSENT_PERMISSIONS) {
        await delay();

        return HttpResponse.json(absentPermissionRole);
      }

      if (entityId === ENTITY_ID_FOR_OWNER_PERMISSIONS) {
        await delay();

        return HttpResponse.json(allowedForOwnRole);
      }

      await delay();

      return HttpResponse.json(fullPermissionRole);
    }
  ),

  http.get<{ entityUserId: string }, string, EntityUserResponse>(
    `*/${ENTITY_USERS_ENDPOINT}/:entityUserId`,
    async ({ params }) => {
      const userFixture =
        entityUsers[params.entityUserId] ?? entityUserByIdFixture;

      await delay();

      return HttpResponse.json(userFixture);
    }
  ),

  http.get<{}, undefined, EntityUserPaginationResponse>(
    `*/${ENTITY_USERS_ENDPOINT}`,
    async () => {
      await delay();

      return HttpResponse.json(
        entityUsersFixture as unknown as EntityUserPaginationResponse
      );
    }
  ),

  http.patch<{}, EntityUserResponse, EntityUserResponse>(
    `*/${ENTITY_USERS_ENDPOINT}/my_entity`,
    async ({ request }) => {
      const jsonBody = await request.json();

      await delay();

      return HttpResponse.json(jsonBody);
    }
  ),
];
