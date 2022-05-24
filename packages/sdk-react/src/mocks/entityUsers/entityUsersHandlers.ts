import { delay } from '@/mocks/utils';
import {
  ENTITY_USERS_ENDPOINT,
  EntityUserPaginationResponse,
  EntityUserResponse,
  RoleResponse,
} from '@monite/sdk-api';

import { rest } from 'msw';

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
  rest.get<undefined, {}, EntityUserResponse>(
    `*/${ENTITY_USERS_ENDPOINT}/me`,
    (req, res, ctx) => {
      const entityId = req.headers.get('x-monite-entity-id');
      const entityUserId = req.headers.get('x-monite-entity-user-id');

      if (entityId === ENTITY_ID_FOR_LOW_PERMISSIONS) {
        return res(delay(), ctx.json(entityUserByIdWithLowPermissionsFixture));
      }

      if (entityId === ENTITY_ID_FOR_READONLY_PERMISSIONS) {
        return res(
          delay(),
          ctx.json(entityUserByIdWithReadonlyPermissionsFixture)
        );
      }

      if (entityId === ENTITY_ID_FOR_EMPTY_PERMISSIONS) {
        return res(
          delay(),
          ctx.json(entityUserByIdWithEmptyPermissionsFixture)
        );
      }

      if (entityId === ENTITY_ID_FOR_ABSENT_PERMISSIONS) {
        return res(
          delay(),
          ctx.json(entityUserByIdWithAbsentPermissionsFixture)
        );
      }

      if (entityId === ENTITY_ID_FOR_OWNER_PERMISSIONS) {
        if (!entityUserId) {
          return res(
            delay(),
            ctx.json(entityUserByIdWithOwnerPermissionsFixture)
          );
        } else {
          return res(
            delay(),
            ctx.json({
              ...entityUserByIdWithOwnerPermissionsFixture,
              id: entityUserId,
            })
          );
        }
      }

      return res(delay(), ctx.json(entityUserByIdFixture));
    }
  ),

  rest.get<undefined, {}, RoleResponse>(
    `*/${ENTITY_USERS_ENDPOINT}/my_role`,
    (req, res, ctx) => {
      const entityId = req.headers.get('x-monite-entity-id');

      if (entityId === ENTITY_ID_FOR_LOW_PERMISSIONS) {
        return res(delay(), ctx.json(lowPermissionRole));
      }

      if (entityId === ENTITY_ID_FOR_READONLY_PERMISSIONS) {
        return res(delay(), ctx.json(readOnlyRole));
      }

      if (entityId === ENTITY_ID_FOR_EMPTY_PERMISSIONS) {
        return res(delay(), ctx.json(emptyPermissionRole));
      }

      if (entityId === ENTITY_ID_FOR_ABSENT_PERMISSIONS) {
        return res(delay(), ctx.json(absentPermissionRole));
      }

      if (entityId === ENTITY_ID_FOR_OWNER_PERMISSIONS) {
        return res(delay(), ctx.json(allowedForOwnRole));
      }

      return res(delay(), ctx.json(fullPermissionRole));
    }
  ),

  rest.get<string, { entityUserId: string }, EntityUserResponse>(
    `*/${ENTITY_USERS_ENDPOINT}/:entityUserId`,
    (req, res, ctx) => {
      const userFixture =
        entityUsers[req.params.entityUserId] ?? entityUserByIdFixture;

      return res(
        delay(Math.random() * (1500 - 500) + 500),
        ctx.json(userFixture)
      );
    }
  ),

  rest.get<undefined, {}, EntityUserPaginationResponse>(
    `*/${ENTITY_USERS_ENDPOINT}`,
    (_, res, ctx) =>
      res(
        ctx.json(entityUsersFixture as unknown as EntityUserPaginationResponse)
      )
  ),

  rest.patch<Partial<EntityUserResponse>, {}, EntityUserResponse>(
    `*/${ENTITY_USERS_ENDPOINT}/my_entity`,
    async (req, res, ctx) => {
      const jsonBody = await req.json<EntityUserResponse>();

      return res(
        delay(),
        ctx.json({
          ...jsonBody,
        })
      );
    }
  ),
];
