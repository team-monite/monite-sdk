import { ActionEnum, WorkflowsPaginationResponse } from '@team-monite/sdk-api';

const data: WorkflowsPaginationResponse = {
  data: [
    {
      id: '501b9be3-88dc-4a6e-9bf2-f11ec98b835d',
      created_by_entity_user_id: '3c4cac2c-cc09-4708-8026-981afaca4db4',
      object_type: 'payable',
      policy_name: 'test',
      policy_description: 'test test test',
      workflow: [
        {
          if: {
            call: {
              method: 'Payables.request_approval_by_entity_user',
              condition: 'not',
            },
            then: {
              call: {
                method: 'Payables.request_approval_by_role_id',
                params: {
                  role_id: '36bde74e-b7fa-42dd-8b32-8589379e604e',
                },
              },
            },
          },
        },
      ],
      trigger: {
        action: 'create',
        amount: {
          gt: 1000,
          lte: 3000,
        },
        version: 1,
        currency: 'EUR',
        statuses: ['new'],
        object_type: 'payable',
        counterparts: [
          'f0e9c37b-893e-412f-b57e-049b2d463196',
          '3e07d3fa-1e86-4259-b26c-e97b1a6edf25',
        ],
        custom_params: {
          comes_from_email: false,
          comes_from_upload: true,
          previously_approved: false,
        },
        created_by_roles: ['36bde74e-b7fa-42dd-8b32-8589379e604e'],
        created_by_users: ['3c4cac2c-cc09-4708-8026-981afaca4db4'],
      },
      action: ActionEnum.CREATE,
      created_at: '2022-07-08T07:21:23.451494+00:00',
      updated_at: '2022-07-08T07:21:23.451505+00:00',
    },
    {
      id: '836a0140-1ec4-4550-9bba-d2aaf0ca462e',
      created_by_entity_user_id: '3c4cac2c-cc09-4708-8026-981afaca4db4',
      object_type: 'payable',
      policy_name: 'test',
      policy_description: '',
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: ['3c4cac2c-cc09-4708-8026-981afaca4db4'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'create',
        amount: {
          gte: 1000,
          lte: 10000,
        },
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
      },
      action: ActionEnum.CREATE,
      created_at: '2022-07-08T07:21:35.860495+00:00',
      updated_at: '2022-07-08T07:21:35.860505+00:00',
    },
    {
      id: '5fa49dbb-5eba-4235-b10e-670e6c30ed18',
      created_by_entity_user_id: '3c4cac2c-cc09-4708-8026-981afaca4db4',
      object_type: 'payable',
      policy_name: 'test',
      policy_description: '',
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: ['3c4cac2c-cc09-4708-8026-981afaca4db4'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'read',
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
      },
      action: ActionEnum.READ,
      created_at: '2022-07-08T07:23:02.802237+00:00',
      updated_at: '2022-07-08T07:23:02.802256+00:00',
    },
    {
      id: '44874807-b9ce-45d2-a719-96e84d66cdb3',
      created_by_entity_user_id: '3c4cac2c-cc09-4708-8026-981afaca4db4',
      object_type: 'payable',
      policy_name: 'test',
      policy_description: '',
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: ['3c4cac2c-cc09-4708-8026-981afaca4db4'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'read',
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
      },
      action: ActionEnum.READ,
      created_at: '2022-07-08T07:23:07.884342+00:00',
      updated_at: '2022-07-08T07:23:07.884352+00:00',
    },
    {
      id: '83c56e6c-eb5b-43aa-91b5-08da2b5e6d18',
      created_by_entity_user_id: '3c4cac2c-cc09-4708-8026-981afaca4db4',
      object_type: 'payable',
      policy_name: 'test',
      policy_description: '',
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: ['3c4cac2c-cc09-4708-8026-981afaca4db4'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'read',
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
      },
      action: ActionEnum.READ,
      created_at: '2022-07-08T07:23:33.605723+00:00',
      updated_at: '2022-07-08T07:23:33.605733+00:00',
    },
    {
      id: 'ec49de80-4609-4a07-8c43-82607466b6f4',
      created_by_entity_user_id: '3c4cac2c-cc09-4708-8026-981afaca4db4',
      object_type: 'payable',
      policy_name: 'test',
      policy_description: '',
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: ['3c4cac2c-cc09-4708-8026-981afaca4db4'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'read',
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
      },
      action: ActionEnum.READ,
      created_at: '2022-07-08T07:23:34.616970+00:00',
      updated_at: '2022-07-08T07:23:34.616987+00:00',
    },
    {
      id: '867eab2c-84cc-4643-baaf-847519c3d518',
      created_by_entity_user_id: '3c4cac2c-cc09-4708-8026-981afaca4db4',
      object_type: 'payable',
      policy_name: 'test',
      policy_description: '',
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: ['3c4cac2c-cc09-4708-8026-981afaca4db4'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'read',
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
      },
      action: ActionEnum.READ,
      created_at: '2022-07-08T07:23:34.876914+00:00',
      updated_at: '2022-07-08T07:23:34.876924+00:00',
    },
  ],
  prev_pagination_token: undefined,
  next_pagination_token: undefined,
};

export default data;
