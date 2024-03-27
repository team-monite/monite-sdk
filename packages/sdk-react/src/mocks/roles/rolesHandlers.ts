import { RolePaginationResponse, RoleResponse } from '@monite/sdk-api';

import { rest } from 'msw';

import { delay } from '../utils';
import { getAllRolesFixture } from './rolesFixtures';

export const rolesHandlers = [
  rest.get<undefined, {}, RolePaginationResponse>(
    `*/roles`,
    (req, res, ctx) => {
      return res(delay(), ctx.json(getAllRolesFixture));
    }
  ),

  rest.get<string, { roleId: string }, RoleResponse>(
    `*/roles/:roleId`,
    (req, res, ctx) => {
      const { roleId } = req.params;
      const role = getAllRolesFixture.data.find((item) => item.id === roleId);
      if (!role) {
        return res(delay(), ctx.status(404));
      }
      return res(delay(), ctx.json(role));
    }
  ),
];
