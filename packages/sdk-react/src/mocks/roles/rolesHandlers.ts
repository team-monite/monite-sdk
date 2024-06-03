import {
  ErrorSchemaResponse,
  RolePaginationResponse,
  RoleResponse,
  ROLES_ENDPOINT,
  UpdateRoleRequest,
} from '@monite/sdk-api';

import { http, HttpResponse, delay } from 'msw';

import { getAllRolesFixture } from './rolesFixtures';

export const rolesHandlers = [
  http.get<{}, undefined, RolePaginationResponse>(`*/roles`, async () => {
    await delay();

    return HttpResponse.json(getAllRolesFixture);
  }),

  http.get<{ roleId: string }, string, RoleResponse | ErrorSchemaResponse>(
    `*/${ROLES_ENDPOINT}/:roleId`,
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

  http.patch<
    { roleId: string },
    UpdateRoleRequest,
    RoleResponse | ErrorSchemaResponse
  >(`*/${ROLES_ENDPOINT}/:roleId`, async ({ request, params }) => {
    const jsonBody = await request.json();
    const { roleId } = params;

    const roleIndex = getAllRolesFixture.data.findIndex(
      (item) => item.id === roleId
    );

    await delay();

    if (roleIndex === -1) {
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

    const updatedRole = {
      ...getAllRolesFixture.data[roleIndex],
      name: jsonBody.name || '',
      permissions: jsonBody.permissions || {},
    };

    return HttpResponse.json(updatedRole);
  }),
];
