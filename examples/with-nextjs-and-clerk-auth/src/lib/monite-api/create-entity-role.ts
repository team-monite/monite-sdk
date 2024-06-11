import { AccessToken } from '@/lib/monite-api/fetch-token';
import {
  createMoniteClient,
  getMoniteApiVersion,
} from '@/lib/monite-api/monite-client';

import type { components, paths } from './schema';

export const createEntityRole = async (
  {
    entity_id,
    role,
  }: {
    entity_id: string;
    role: paths['/roles']['post']['requestBody']['content']['application/json'];
  },
  token: AccessToken
) => {
  const { POST } = createMoniteClient({
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`,
    },
  });

  const { data, error, response } = await POST('/roles', {
    params: {
      header: {
        'x-monite-entity-id': entity_id,
        'x-monite-version': getMoniteApiVersion(),
      },
    },
    body: role,
  });

  if (error) {
    console.error(
      `Failed to create Entity Role for the entity_id: "${entity_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(`Entity Role create failed: ${JSON.stringify(error)}`);
  }

  return data;
};

/**
 * Creates Entity roles from `roles` and default roles
 *
 * @param entityId The entity id
 * @param roles The roles names to create
 * @param token The access token
 * @returns Merged roles: the new roles with the previously existing roles
 */
export const createEntityRoles = async <
  Role extends keyof typeof roles_default_permissions
>(
  entityId: string,
  roles: Array<Role>,
  token: AccessToken
): Promise<Record<Role, string>> => {
  const entityNewRoleEntries = await Promise.all(
    roles.map(async (roleName) => {
      const permissions = roles_default_permissions[roleName];

      if (!permissions)
        throw new Error(`No default permissions found for role "${roleName}"`);

      const { id: newRoleId } = await createEntityRole(
        {
          entity_id: entityId,
          role: {
            name: roleName,
            permissions: permissionsAdapter(permissions),
          },
        },
        token
      );

      return [roleName, newRoleId] as const;
    })
  );

  return Object.fromEntries(entityNewRoleEntries) as Record<
    (typeof entityNewRoleEntries)[number][0],
    (typeof entityNewRoleEntries)[number][1]
  >;
};

export const isExistingRole = (
  role: unknown
): role is keyof typeof roles_default_permissions =>
  typeof role === 'string' && role in roles_default_permissions;

export function permissionsAdapter(actions: {
  [ObjectType in BizObjectType]: BizObjectActions<ObjectType>;
}) {
  return {
    objects: Object.entries(actions).map(([object_type, objectActions]) => {
      return {
        object_type: object_type,
        actions: Object.entries(objectActions).map(
          ([action_name, permission]) => ({
            action_name,
            permission,
          })
        ) as unknown as components['schemas']['BizObjectsSchema']['objects'],
      };
    }),
  } as Required<components['schemas']['BizObjectsSchema']>;
}

type DefaultRoleName =
  | 'admin'
  | 'basic_member'
  | 'guest_member'
  | 'service_member'
  | 'payables_employee_member'
  | 'receivables_employee_member'
  | 'approver_member'
  | 'payer_member';

export const roles_default_permissions: {
  [role in DefaultRoleName]: {
    [ObjectType in BizObjectType]: BizObjectActions<ObjectType>;
  };
} = {
  admin: {
    payable: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      submit: 'allowed',
      approve: 'allowed',
      pay: 'allowed',
      delete: 'allowed',
      cancel: 'allowed',
      reopen: 'allowed',
      create_from_mail: 'allowed',
    },
    receivable: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    counterpart: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    counterpart_vat_id: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    product: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    workflow: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    entity: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    entity_vat_ids: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    entity_bank_account: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    entity_user: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    comment: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    export: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    role: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    tag: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    payables_purchase_order: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    payment_reminder: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    overdue_reminder: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    todo_task: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    todo_task_mute: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    approval_request: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    approval_policy: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    payment_record: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    reconciliation: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    transaction: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    onboarding: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    person: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
  },
  basic_member: {
    payable: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      submit: 'allowed',
      approve: 'allowed',
      pay: 'allowed',
      delete: 'allowed',
      cancel: 'allowed',
      reopen: 'allowed',
      create_from_mail: 'allowed',
    },
    receivable: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    counterpart: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    counterpart_vat_id: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    product: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    workflow: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    entity: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    entity_vat_ids: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    entity_bank_account: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    entity_user: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    comment: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    export: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    role: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    tag: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    payables_purchase_order: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    payment_reminder: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    overdue_reminder: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    todo_task: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    todo_task_mute: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    approval_request: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    approval_policy: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    payment_record: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    reconciliation: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    transaction: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    onboarding: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    person: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
  },
  guest_member: {
    payable: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      submit: 'not_allowed',
      approve: 'not_allowed',
      pay: 'not_allowed',
      delete: 'not_allowed',
      cancel: 'not_allowed',
      reopen: 'not_allowed',
      create_from_mail: 'not_allowed',
    },
    receivable: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    counterpart: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    counterpart_vat_id: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    product: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    workflow: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_vat_ids: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_bank_account: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_user: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    comment: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    export: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    role: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    tag: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payables_purchase_order: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payment_reminder: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    overdue_reminder: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    todo_task: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    todo_task_mute: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    approval_request: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    approval_policy: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payment_record: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    reconciliation: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    transaction: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    onboarding: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    person: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
  },
  service_member: {
    payable: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      submit: 'not_allowed',
      approve: 'not_allowed',
      pay: 'not_allowed',
      delete: 'not_allowed',
      cancel: 'not_allowed',
      reopen: 'not_allowed',
      create_from_mail: 'not_allowed',
    },
    receivable: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    counterpart: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    counterpart_vat_id: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    product: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    workflow: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    entity: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_vat_ids: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    entity_bank_account: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    entity_user: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    comment: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    export: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    role: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    tag: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    payables_purchase_order: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payment_reminder: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    overdue_reminder: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    todo_task: {
      read: 'allowed',
      create: 'allowed_for_own',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    todo_task_mute: {
      read: 'allowed',
      create: 'allowed_for_own',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    approval_request: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    approval_policy: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    payment_record: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    reconciliation: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    transaction: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    onboarding: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    person: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
  },
  payables_employee_member: {
    payable: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      submit: 'allowed',
      approve: 'not_allowed',
      pay: 'not_allowed',
      delete: 'not_allowed',
      cancel: 'not_allowed',
      reopen: 'not_allowed',
      create_from_mail: 'allowed',
    },
    receivable: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    counterpart: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    counterpart_vat_id: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    product: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    workflow: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_vat_ids: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_bank_account: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_user: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    comment: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    export: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    role: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    tag: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payables_purchase_order: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payment_reminder: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    overdue_reminder: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    todo_task: {
      read: 'allowed',
      create: 'allowed_for_own',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    todo_task_mute: {
      read: 'allowed',
      create: 'allowed_for_own',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    approval_request: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    approval_policy: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payment_record: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    reconciliation: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    transaction: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    onboarding: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    person: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
  },
  receivables_employee_member: {
    payable: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      submit: 'not_allowed',
      approve: 'not_allowed',
      pay: 'not_allowed',
      delete: 'not_allowed',
      cancel: 'not_allowed',
      reopen: 'not_allowed',
      create_from_mail: 'not_allowed',
    },
    receivable: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed',
      delete: 'allowed',
    },
    counterpart: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    counterpart_vat_id: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    product: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    workflow: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_vat_ids: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_bank_account: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_user: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    comment: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    export: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    role: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    tag: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payables_purchase_order: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payment_reminder: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    overdue_reminder: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    todo_task: {
      read: 'allowed',
      create: 'allowed_for_own',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    todo_task_mute: {
      read: 'allowed',
      create: 'allowed_for_own',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    approval_request: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    approval_policy: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payment_record: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    reconciliation: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    transaction: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    onboarding: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    person: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
  },
  approver_member: {
    payable: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      submit: 'not_allowed',
      approve: 'allowed',
      pay: 'not_allowed',
      delete: 'not_allowed',
      cancel: 'allowed',
      reopen: 'not_allowed',
      create_from_mail: 'not_allowed',
    },
    receivable: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    counterpart: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    counterpart_vat_id: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    product: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    workflow: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_vat_ids: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_bank_account: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_user: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    comment: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    export: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    role: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    tag: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payables_purchase_order: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payment_reminder: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    overdue_reminder: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    todo_task: {
      read: 'allowed',
      create: 'allowed_for_own',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    todo_task_mute: {
      read: 'allowed',
      create: 'allowed_for_own',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    approval_request: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    approval_policy: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payment_record: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    reconciliation: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    transaction: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    onboarding: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    person: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
  },
  payer_member: {
    payable: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      submit: 'not_allowed',
      approve: 'not_allowed',
      pay: 'allowed',
      delete: 'not_allowed',
      cancel: 'not_allowed',
      reopen: 'not_allowed',
      create_from_mail: 'not_allowed',
    },
    receivable: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    counterpart: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    counterpart_vat_id: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    product: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    workflow: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_vat_ids: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_bank_account: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    entity_user: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    comment: {
      read: 'allowed',
      create: 'allowed',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    export: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    role: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    tag: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payables_purchase_order: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payment_reminder: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    overdue_reminder: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    todo_task: {
      read: 'allowed',
      create: 'allowed_for_own',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    todo_task_mute: {
      read: 'allowed',
      create: 'allowed_for_own',
      update: 'allowed_for_own',
      delete: 'allowed_for_own',
    },
    approval_request: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    approval_policy: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    payment_record: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    reconciliation: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    transaction: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    onboarding: {
      read: 'not_allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
    person: {
      read: 'allowed',
      create: 'not_allowed',
      update: 'not_allowed',
      delete: 'not_allowed',
    },
  },
};

type BizObjectType = NonNullable<BizObjects['object_type']>;

type BizObjects = Required<
  NonNullable<components['schemas']['BizObjectsSchema']['objects']>[number]
>;

type BizObject<
  T extends BizObjectType,
  BizObjectItem extends { object_type: string }
> = BizObjectItem extends { object_type: infer ObjectType }
  ? ObjectType extends T
    ? BizObjectItem
    : never
  : never;

type BizObjectAction<
  T extends BizObjectType,
  BizObjectItem extends { object_type: T }
> = BizObjectItem extends {
  actions: Array<infer Actions>;
}
  ? Required<Actions> extends {
      action_name: infer ActionName;
    }
    ? ActionName extends string
      ? ActionName
      : never
    : never
  : never;

type BizObjectActions<
  T extends BizObjectType,
  BizObjectItem = BizObject<T, BizObjects>
> = BizObjectItem extends { object_type: T }
  ? {
      [ActionNameKey in BizObjectAction<
        T,
        BizObjectItem
      >]: BizObjectItem extends {
        actions: Array<infer Actions>;
      }
        ? Required<Actions> extends {
            action_name: infer ActionName;
            permission: infer Permission;
          }
          ? ActionName extends ActionNameKey
            ? Permission
            : never
          : never
        : never;
    }
  : never;
