import {
  ErrorSchemaResponse,
  RolePaginationResponse,
  RoleResponse,
} from '@monite/sdk-api';

import { http, HttpResponse, delay } from 'msw';

import { getAllRolesFixture } from './rolesFixtures';

export const rolesHandlers = [
  http.get<{}, undefined, RolePaginationResponse>(`*/roles`, async () => {
    await delay();

    return HttpResponse.json(getAllRolesFixture);
  }),

  http.get<{ roleId: string }, string, RoleResponse | ErrorSchemaResponse>(
    `*/roles/:roleId`,
    async ({ params }) => {
      const { roleId } = params;
      const role = getAllRolesFixture.data.find((item) => item.id === roleId);

      await delay();
      if (!role) {
        return HttpResponse.json(
          {
            error: {
              message: 'Role not found',
            },
          },
          {
            status: 404,
          }
        );
      }

      return HttpResponse.json(role);
    }
  ),
];
