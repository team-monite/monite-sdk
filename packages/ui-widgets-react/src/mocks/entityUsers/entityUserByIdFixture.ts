export const entityUserByIdFixture = {
  id: 'ea837e28-509b-4b6a-a600-d54b6aa0b1f5',
  role: {
    id: 'ee9d2c66-48a9-4b0a-9c28-6c1c2793e067',
    name: 'Full permission role',
    permissions: {
      objects: [
        {
          object_type: 'payable',
          actions: [
            { action_name: 'read', permission: 'allowed' },
            { action_name: 'create', permission: 'allowed' },
            { action_name: 'update', permission: 'allowed' },
            { action_name: 'submit', permission: 'allowed' },
            { action_name: 'approve', permission: 'allowed' },
            { action_name: 'pay', permission: 'allowed' },
            { action_name: 'delete', permission: 'allowed' },
          ],
        },
        {
          object_type: 'workflow',
          actions: [
            { action_name: 'read', permission: 'allowed' },
            { action_name: 'create', permission: 'allowed' },
            { action_name: 'update', permission: 'allowed' },
            { action_name: 'delete', permission: 'allowed' },
          ],
        },
        {
          object_type: 'entity',
          actions: [
            { action_name: 'read', permission: 'allowed' },
            { action_name: 'create', permission: 'allowed' },
            { action_name: 'update', permission: 'allowed' },
            { action_name: 'delete', permission: 'allowed' },
          ],
        },
        {
          object_type: 'entity_user',
          actions: [
            { action_name: 'read', permission: 'allowed' },
            { action_name: 'create', permission: 'allowed' },
            { action_name: 'update', permission: 'allowed' },
            { action_name: 'delete', permission: 'allowed' },
          ],
        },
        {
          object_type: 'entity_bank_account',
          actions: [
            { action_name: 'read', permission: 'allowed' },
            { action_name: 'create', permission: 'allowed' },
            { action_name: 'update', permission: 'allowed' },
            { action_name: 'delete', permission: 'allowed' },
          ],
        },
        {
          object_type: 'comment',
          actions: [
            { action_name: 'read', permission: 'allowed' },
            { action_name: 'create', permission: 'allowed' },
            { action_name: 'update', permission: 'allowed' },
          ],
        },
        {
          object_type: 'export',
          actions: [
            { action_name: 'read', permission: 'allowed' },
            { action_name: 'create', permission: 'allowed' },
          ],
        },
        {
          object_type: 'tag',
          actions: [
            { action_name: 'read', permission: 'allowed' },
            { action_name: 'create', permission: 'allowed' },
            { action_name: 'update', permission: 'allowed' },
            { action_name: 'delete', permission: 'allowed' },
            { action_name: 'read', permission: 'allowed' },
            { action_name: 'read', permission: 'allowed' },
          ],
        },
        {
          object_type: 'counterpart',
          actions: [
            { action_name: 'read', permission: 'allowed' },
            { action_name: 'create', permission: 'allowed' },
            { action_name: 'delete', permission: 'allowed' },
            { action_name: 'update', permission: 'allowed' },
          ],
        },
        {
          object_type: 'receivable',
          actions: [
            { action_name: 'read', permission: 'allowed' },
            { action_name: 'create', permission: 'allowed' },
            { action_name: 'delete', permission: 'allowed' },
            { action_name: 'update', permission: 'allowed' },
          ],
        },
      ],
    },
    status: 'active',
    created_at: '2022-08-30T13:37:09.358621+00:00',
    updated_at: '2022-10-21T12:19:55.162277+00:00',
  },
  userpic: {
    url: 'https://cdn-icons-png.flaticon.com/512/1303/1303472.png',
  },
  info: { email: null, phone: null },
  login: 'monite_entity_user_login_083020221631434735',
  first_name: 'Ivan',
  last_name: 'Ivanov',
  status: 'active',
  created_at: '2022-08-30T13:31:43.971531+00:00',
  updated_at: '2023-01-11T18:11:12.340654+00:00',
};
