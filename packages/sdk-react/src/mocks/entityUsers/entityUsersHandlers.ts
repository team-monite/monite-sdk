import { components } from '@/api';

import { http, HttpResponse, delay } from 'msw';

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
    `*/entity_users/me`,
    async ({ request }) => {
      // TODO Real API doesn't use the next header for this method. Replace this workaround https://monite.atlassian.net/browse/DEV-11719
      const entityId = request.headers.get('x-monite-entity-id');

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
        await delay();

        return HttpResponse.json(entityUserByIdWithOwnerPermissionsFixture);
      }

      await delay();

      return HttpResponse.json(entityUserByIdFixture);
    }
  ),

  http.get<{}, undefined, RoleResponse>(
    `*/entity_users/my_role`,
    // TODO Real API doesn't use the next header for this method. Replace this workaround https://monite.atlassian.net/browse/DEV-11719
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
    `*/entity_users/:entityUserId`,
    async ({ params }) => {
      const userFixture =
        entityUsers[params.entityUserId] ?? entityUserByIdFixture;

      await delay();

      return HttpResponse.json(userFixture);
    }
  ),

  http.get<{}, undefined, EntityUserPaginationResponse>(
    `*/entity_users`,
    async () => {
      await delay();

      return HttpResponse.json(
        entityUsersFixture as unknown as EntityUserPaginationResponse
      );
    }
  ),

  http.patch<{}, EntityUserResponse, EntityUserResponse>(
    `*/entity_users/my_entity`,
    async ({ request }) => {
      const jsonBody = await request.json();

      await delay();

      return HttpResponse.json(jsonBody);
    }
  ),
];

type EntityUserPaginationResponse =
  components['schemas']['EntityUserPaginationResponse'];
type EntityUserResponse = components['schemas']['EntityUserResponse'];
type RoleResponse = components['schemas']['RoleResponse'];
