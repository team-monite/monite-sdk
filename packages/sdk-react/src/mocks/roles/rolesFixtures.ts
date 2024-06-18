import { ActionEnum } from '@/utils/types';
import { faker } from '@faker-js/faker';
import {
  CommonSchema,
  CreateRoleRequest,
  PayableActionEnum,
  PermissionEnum,
  RolePaginationResponse,
  RoleResponse,
  StatusEnum,
} from '@monite/sdk-api';

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
            action_name: PayableActionEnum.READ,
            permission: PermissionEnum.ALLOWED,
          },
          {
            action_name: PayableActionEnum.CREATE,
            permission: PermissionEnum.ALLOWED,
          },
          {
            action_name: PayableActionEnum.UPDATE,
            permission: PermissionEnum.ALLOWED,
          },
          {
            action_name: PayableActionEnum.SUBMIT,
            permission: PermissionEnum.ALLOWED,
          },
          {
            action_name: PayableActionEnum.APPROVE,
            permission: PermissionEnum.ALLOWED,
          },
          {
            action_name: PayableActionEnum.PAY,
            permission: PermissionEnum.ALLOWED,
          },
          {
            action_name: PayableActionEnum.DELETE,
            permission: PermissionEnum.ALLOWED,
          },
          {
            action_name: PayableActionEnum.CANCEL,
            permission: PermissionEnum.ALLOWED,
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
      ].map((object_type): CommonSchema => {
        return {
          object_type: object_type as unknown as CommonSchema['object_type'], // TODO: remove after fix https://monite.atlassian.net/browse/DEV-6294
          actions: [
            {
              action_name: ActionEnum.READ,
              permission: PermissionEnum.ALLOWED,
            },
            {
              action_name: ActionEnum.CREATE,
              permission: PermissionEnum.ALLOWED,
            },
            {
              action_name: ActionEnum.UPDATE,
              permission: PermissionEnum.ALLOWED,
            },
            {
              action_name: ActionEnum.DELETE,
              permission: PermissionEnum.ALLOWED,
            },
          ],
        };
      }),
    ],
  },
  status: StatusEnum.ACTIVE,
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
            action_name: PayableActionEnum.READ,
            permission: PermissionEnum.ALLOWED,
          },
          {
            action_name: PayableActionEnum.CREATE,
            permission: PermissionEnum.NOT_ALLOWED,
          },
          {
            action_name: PayableActionEnum.UPDATE,
            permission: PermissionEnum.ALLOWED,
          },
          {
            action_name: PayableActionEnum.SUBMIT,
            permission: PermissionEnum.NOT_ALLOWED,
          },
          {
            action_name: PayableActionEnum.APPROVE,
            permission: PermissionEnum.NOT_ALLOWED,
          },
          {
            action_name: PayableActionEnum.PAY,
            permission: PermissionEnum.NOT_ALLOWED,
          },
          {
            action_name: PayableActionEnum.DELETE,
            permission: PermissionEnum.NOT_ALLOWED,
          },
          {
            action_name: PayableActionEnum.CANCEL,
            permission: PermissionEnum.NOT_ALLOWED,
          },
        ],
      },
      {
        // TODO: remove @ts-expect-error  after fix https://monite.atlassian.net/browse/DEV-6294
        // @ts-expect-error We don't have CommonSchemaEnum
        object_type: 'approval_policy',
        actions: [
          {
            action_name: ActionEnum.READ,
            permission: PermissionEnum.NOT_ALLOWED,
          },
          {
            action_name: ActionEnum.CREATE,
            permission: PermissionEnum.NOT_ALLOWED,
          },
          {
            action_name: ActionEnum.UPDATE,
            permission: PermissionEnum.NOT_ALLOWED,
          },
          {
            action_name: ActionEnum.DELETE,
            permission: PermissionEnum.NOT_ALLOWED,
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
      ].map((object_type): CommonSchema => {
        return {
          object_type: object_type as unknown as CommonSchema['object_type'], // TODO: remove after fix https://monite.atlassian.net/browse/DEV-6294
          actions: [
            {
              action_name: ActionEnum.READ,
              permission: PermissionEnum.ALLOWED,
            },
            {
              action_name: ActionEnum.CREATE,
              permission: PermissionEnum.NOT_ALLOWED,
            },
            {
              action_name: ActionEnum.UPDATE,
              permission: PermissionEnum.ALLOWED,
            },
            {
              action_name: ActionEnum.DELETE,
              permission: PermissionEnum.NOT_ALLOWED,
            },
          ],
        };
      }),
    ],
  },
  status: StatusEnum.ACTIVE,
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
            action_name: PayableActionEnum.READ,
            permission: PermissionEnum.ALLOWED,
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
      ].map((object_type): CommonSchema => {
        return {
          object_type: object_type as unknown as CommonSchema['object_type'], // TODO: remove after fix https://monite.atlassian.net/browse/DEV-6294
          actions: [
            {
              action_name: ActionEnum.READ,
              permission: PermissionEnum.ALLOWED,
            },
          ],
        };
      }),
    ],
  },
  status: StatusEnum.ACTIVE,
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
            action_name: PayableActionEnum.READ,
            permission: PermissionEnum.ALLOWED_FOR_OWN,
          },
          {
            action_name: PayableActionEnum.CREATE,
            permission: PermissionEnum.ALLOWED_FOR_OWN,
          },
          {
            action_name: PayableActionEnum.UPDATE,
            permission: PermissionEnum.ALLOWED_FOR_OWN,
          },
          {
            action_name: PayableActionEnum.SUBMIT,
            permission: PermissionEnum.ALLOWED_FOR_OWN,
          },
          {
            action_name: PayableActionEnum.APPROVE,
            permission: PermissionEnum.ALLOWED_FOR_OWN,
          },
          {
            action_name: PayableActionEnum.PAY,
            permission: PermissionEnum.ALLOWED_FOR_OWN,
          },
          {
            action_name: PayableActionEnum.DELETE,
            permission: PermissionEnum.ALLOWED_FOR_OWN,
          },
          {
            action_name: PayableActionEnum.CANCEL,
            permission: PermissionEnum.ALLOWED_FOR_OWN,
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
      ].map((object_type): CommonSchema => {
        return {
          object_type: object_type as unknown as CommonSchema['object_type'], // TODO: remove after fix https://monite.atlassian.net/browse/DEV-6294
          actions: [
            {
              action_name: ActionEnum.READ,
              permission: PermissionEnum.ALLOWED_FOR_OWN,
            },
            {
              action_name: ActionEnum.CREATE,
              permission: PermissionEnum.ALLOWED_FOR_OWN,
            },
            {
              action_name: ActionEnum.UPDATE,
              permission: PermissionEnum.ALLOWED_FOR_OWN,
            },
            {
              action_name: ActionEnum.DELETE,
              permission: PermissionEnum.ALLOWED_FOR_OWN,
            },
          ],
        };
      }),
    ],
  },
  status: StatusEnum.ACTIVE,
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
      ].map((object_type): CommonSchema => {
        return {
          object_type: object_type as unknown as CommonSchema['object_type'], // TODO: remove after fix https://monite.atlassian.net/browse/DEV-6294
          actions: [],
        };
      }),
    ],
  },
  status: StatusEnum.ACTIVE,
  created_at: '2022-08-30T13:37:09.358621+00:00',
  updated_at: '2022-10-21T12:19:55.162277+00:00',
};

export const absentPermissionRole: RoleResponse = {
  id: ABSENT_PERMISSION_ROLE_ID,
  name: 'Absent permission role',
  permissions: {},
  status: StatusEnum.ACTIVE,
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

export const createRole = (role: CreateRoleRequest) => {
  return {
    id: faker.string.nanoid(),
    name: role.name,
    permissions: role.permissions,
    status: StatusEnum.ACTIVE,
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
  };
};
