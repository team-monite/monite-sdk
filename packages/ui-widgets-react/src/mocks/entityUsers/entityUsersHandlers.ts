import { rest } from 'msw';
import {
  ENTITY_USERS_ENDPOINT,
  EntityUserPaginationResponse,
} from '@team-monite/sdk-api';
import { entityUsersFixture } from './entityUsersFixture';

export const entityUsersHandlers = [
  rest.get<undefined, {}, EntityUserPaginationResponse>(
    ENTITY_USERS_ENDPOINT,
    (_, res, ctx) =>
      res(
        ctx.json(entityUsersFixture as unknown as EntityUserPaginationResponse)
      )
  ),
];
