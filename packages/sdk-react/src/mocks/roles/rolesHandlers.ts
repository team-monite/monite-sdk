import { components } from '@/api';

import { http, HttpResponse, delay } from 'msw';

import { createRole, getAllRolesFixture } from './rolesFixtures';

export const rolesHandlers = [
  http.get<{}, undefined, RolePaginationResponse>(
    `*/roles`,
    async ({ request }) => {
      const url = new URL(request.url);
      const searchParams = url.searchParams;
      const id_in = searchParams.getAll('id__in');

      if (id_in.length > 0) {
        await delay();
        return HttpResponse.json({
          data: getAllRolesFixture.data.filter((role) =>
            id_in.includes(role.id)
          ),
          prev_pagination_token: undefined,
          next_pagination_token: undefined,
        });
      }

      await delay();

      return HttpResponse.json(getAllRolesFixture);
    }
  ),

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

  http.post<{}, CreateRoleRequest, RoleResponse | ErrorSchemaResponse>(
    `*/roles`,
    async ({ request }) => {
      const jsonBody = await request.json();

      await delay();

      const newRole = createRole(jsonBody);

      getAllRolesFixture.data.push(newRole);

      return HttpResponse.json(newRole);
    }
  ),

  http.patch<
    { roleId: string },
    UpdateRoleRequest,
    RoleResponse | ErrorSchemaResponse
  >(`*/roles/:roleId`, async ({ request, params }) => {
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

type CreateRoleRequest = components['schemas']['CreateRoleRequest'];
type ErrorSchemaResponse = components['schemas']['ErrorSchemaResponse'];
type RolePaginationResponse = components['schemas']['RolePaginationResponse'];
type RoleResponse = components['schemas']['RoleResponse'];
type UpdateRoleRequest = components['schemas']['UpdateRoleRequest'];
