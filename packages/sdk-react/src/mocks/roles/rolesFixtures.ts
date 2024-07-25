import { components } from '@/api';
import { faker } from '@faker-js/faker';

export const FULL_PERMISSION_ROLE_ID = 'full_permission_role_id';
export const LOW_PERMISSION_ROLE_ID = 'low_permission_role_id';
export const READ_ONLY_ROLE_ID = 'read_only_role_id';
export const ALLOWED_FOR_OWN_ROLE_ID = 'allowed_for_own_role_id';
export const ABSENT_PERMISSION_ROLE_ID = 'absent_permission_role_id';
export const EMPTY_PERMISSION_ROLE_ID = 'empty_permission_role_id';

export const fullPermissionRole: RoleResponse = {
  id: FULL_PERMISSION_ROLE_ID,
  name: 'Full permission role',
  permissions: {
    objects: [
      {
        object_type: 'payable',
        actions: [
          {
            action_name: 'read',
            permission: 'allowed',
          },
          {
            action_name: 'create',
            permission: 'allowed',
          },
          {
            action_name: 'update',
            permission: 'allowed',
          },
          {
            action_name: 'submit',
            permission: 'allowed',
          },
          {
            action_name: 'approve',
            permission: 'allowed',
          },
          {
            action_name: 'pay',
            permission: 'allowed',
          },
          {
            action_name: 'delete',
            permission: 'allowed',
          },
          {
            action_name: 'cancel',
            permission: 'allowed',
          },
        ],
      },
      ...[
        'approval_policy',
        'approval_request',
        'role',
        'counterpart',
        'product',
        'receivable',
        'tag',
        'workflow',
        'payment_reminder',
        'overdue_reminder',
      ].map((object_type): CommonSchema => {
        return {
          object_type: object_type as unknown as CommonSchema['object_type'], // TODO: remove after fix https://monite.atlassian.net/browse/DEV-6294
          actions: [
            {
              action_name: 'read',
              permission: 'allowed',
            },
            {
              action_name: 'create',
              permission: 'allowed',
            },
            {
              action_name: 'update',
              permission: 'allowed',
            },
            {
              action_name: 'delete',
              permission: 'allowed',
            },
          ],
        };
      }),
    ],
  },
  status: 'active',
  created_at: '2022-08-30T13:37:09.358621+00:00',
  updated_at: '2022-10-21T12:19:55.162277+00:00',
};

export const lowPermissionRole: RoleResponse = {
  id: LOW_PERMISSION_ROLE_ID,
  name: 'Full permission role',
  permissions: {
    objects: [
      {
        object_type: 'payable',
        actions: [
          {
            action_name: 'read',
            permission: 'allowed',
          },
          {
            action_name: 'create',
            permission: 'not_allowed',
          },
          {
            action_name: 'update',
            permission: 'allowed',
          },
          {
            action_name: 'submit',
            permission: 'not_allowed',
          },
          {
            action_name: 'approve',
            permission: 'not_allowed',
          },
          {
            action_name: 'pay',
            permission: 'not_allowed',
          },
          {
            action_name: 'delete',
            permission: 'not_allowed',
          },
          {
            action_name: 'cancel',
            permission: 'not_allowed',
          },
        ],
      },
      {
        object_type: 'approval_policy',
        actions: [
          {
            action_name: 'read',
            permission: 'not_allowed',
          },
          {
            action_name: 'create',
            permission: 'not_allowed',
          },
          {
            action_name: 'update',
            permission: 'not_allowed',
          },
          {
            action_name: 'delete',
            permission: 'not_allowed',
          },
        ],
      },
      ...[
        'counterpart',
        'product',
        'receivable',
        'tag',
        'workflow',
        'role',
        'payment_reminder',
        'overdue_reminder',
      ].map((object_type): CommonSchema => {
        return {
          object_type: object_type as unknown as CommonSchema['object_type'], // TODO: remove after fix https://monite.atlassian.net/browse/DEV-6294
          actions: [
            {
              action_name: 'read',
              permission: 'allowed',
            },
            {
              action_name: 'create',
              permission: 'not_allowed',
            },
            {
              action_name: 'update',
              permission: 'allowed',
            },
            {
              action_name: 'delete',
              permission: 'not_allowed',
            },
          ],
        };
      }),
    ],
  },
  status: 'active',
  created_at: '2022-08-30T13:37:09.358621+00:00',
  updated_at: '2022-10-21T12:19:55.162277+00:00',
};

export const readOnlyRole: RoleResponse = {
  id: READ_ONLY_ROLE_ID,
  name: 'Read only permission role',
  permissions: {
    objects: [
      {
        object_type: 'payable',
        actions: [
          {
            action_name: 'read',
            permission: 'allowed',
          },
        ],
      },
      ...[
        'approval_policy',
        'approval_request',
        'role',
        'counterpart',
        'product',
        'receivable',
        'tag',
        'workflow',
        'payment_reminder',
        'overdue_reminder',
      ].map((object_type): CommonSchema => {
        return {
          object_type: object_type as unknown as CommonSchema['object_type'], // TODO: remove after fix https://monite.atlassian.net/browse/DEV-6294
          actions: [
            {
              action_name: 'read',
              permission: 'allowed',
            },
          ],
        };
      }),
    ],
  },
  status: 'active',
  created_at: '2022-08-30T13:37:09.358621+00:00',
  updated_at: '2022-10-21T12:19:55.162277+00:00',
};

export const allowedForOwnRole: RoleResponse = {
  id: ALLOWED_FOR_OWN_ROLE_ID,
  name: 'Allowed for own permission role',
  permissions: {
    objects: [
      {
        object_type: 'payable',
        actions: [
          {
            action_name: 'read',
            permission: 'allowed_for_own',
          },
          {
            action_name: 'create',
            permission: 'allowed_for_own',
          },
          {
            action_name: 'update',
            permission: 'allowed_for_own',
          },
          {
            action_name: 'submit',
            permission: 'allowed_for_own',
          },
          {
            action_name: 'approve',
            permission: 'allowed_for_own',
          },
          {
            action_name: 'pay',
            permission: 'allowed_for_own',
          },
          {
            action_name: 'delete',
            permission: 'allowed_for_own',
          },
          {
            action_name: 'cancel',
            permission: 'allowed_for_own',
          },
        ],
      },
      ...[
        'approval_policy',
        'role',
        'counterpart',
        'product',
        'receivable',
        'tag',
        'workflow',
        'payment_reminder',
        'overdue_reminder',
      ].map((object_type): CommonSchema => {
        return {
          object_type: object_type as unknown as CommonSchema['object_type'], // TODO: remove after fix https://monite.atlassian.net/browse/DEV-6294
          actions: [
            {
              action_name: 'read',
              permission: 'allowed_for_own',
            },
            {
              action_name: 'create',
              permission: 'allowed_for_own',
            },
            {
              action_name: 'update',
              permission: 'allowed_for_own',
            },
            {
              action_name: 'delete',
              permission: 'allowed_for_own',
            },
          ],
        };
      }),
    ],
  },
  status: 'active',
  created_at: '2022-08-30T13:37:09.358621+00:00',
  updated_at: '2022-10-21T12:19:55.162277+00:00',
};

export const emptyPermissionRole: RoleResponse = {
  id: EMPTY_PERMISSION_ROLE_ID,
  name: 'Empty permission role',
  permissions: {
    objects: [
      {
        object_type: 'payable',
        actions: [],
      },
      ...[
        'approval_policy',
        'role',
        'counterpart',
        'product',
        'receivable',
        'tag',
        'workflow',
        'payment_reminder',
        'overdue_reminder',
      ].map((object_type): CommonSchema => {
        return {
          object_type: object_type as unknown as CommonSchema['object_type'], // TODO: remove after fix https://monite.atlassian.net/browse/DEV-6294
          actions: [],
        };
      }),
    ],
  },
  status: 'active',
  created_at: '2022-08-30T13:37:09.358621+00:00',
  updated_at: '2022-10-21T12:19:55.162277+00:00',
};

export const absentPermissionRole: RoleResponse = {
  id: ABSENT_PERMISSION_ROLE_ID,
  name: 'Absent permission role',
  permissions: {},
  status: 'active',
  created_at: '2022-08-30T13:37:09.358621+00:00',
  updated_at: '2022-10-21T12:19:55.162277+00:00',
};

export const getAllRolesFixture: RolePaginationResponse = {
  data: [
    fullPermissionRole,
    lowPermissionRole,
    readOnlyRole,
    allowedForOwnRole,
    emptyPermissionRole,
    absentPermissionRole,
  ],
  prev_pagination_token: undefined,
  next_pagination_token: undefined,
};

export const createRole = (
  role: CreateRoleRequest
): components['schemas']['RoleResponse'] => {
  return {
    id: faker.string.nanoid(),
    name: role.name,
    permissions: role.permissions,
    status: 'active',
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
  };
};

type CommonSchema = components['schemas']['CommonSchema'];
type CreateRoleRequest = components['schemas']['CreateRoleRequest'];
type RolePaginationResponse = components['schemas']['RolePaginationResponse'];
type RoleResponse = components['schemas']['RoleResponse'];
