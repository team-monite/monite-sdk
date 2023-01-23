import { rest } from 'msw';
import {
  ENTITY_USERS_ENDPOINT,
  EntityUserPaginationResponse,
} from '@team-monite/sdk-api';
import { entityUsersFixture } from './entityUsersFixture';
import { entityUserByIdFixture } from './entityUserByIdFixture';

export const entityUsersHandlers = [
  rest.get<undefined, {}, EntityUserPaginationResponse>(
    ENTITY_USERS_ENDPOINT,
    (_, res, ctx) =>
      res(
        ctx.json(entityUsersFixture as unknown as EntityUserPaginationResponse)
      )
  ),
  rest.get<string, {}, EntityUserPaginationResponse>(
    `${ENTITY_USERS_ENDPOINT}/:entityUserId`,
    (_, res, ctx) =>
      res(
        ctx.json(
          entityUserByIdFixture as unknown as EntityUserPaginationResponse
        )
      )
  ),
];
