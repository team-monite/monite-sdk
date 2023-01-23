export const workflowsListFixture = {
  data: [
    {
      id: 'e0076fe5-b2b8-4cb7-b3fc-7cf92167beb3',
      created_by_entity_user: {
        id: 'b32bbd04-72ba-43a5-b893-acd95cb10ea2',
        role: {
          id: '2b2f7f77-dc89-47f3-b593-c85e9fd9f766',
          name: 'monite_role_01102023190652203',
          permissions: {
            objects: [
              {
                object_type: 'workflow',
                actions: [
                  { action_name: 'read', permission: 'allowed_for_own' },
                  { action_name: 'update', permission: 'allowed_for_own' },
                  { action_name: 'create', permission: 'allowed' },
                  { action_name: 'delete', permission: 'allowed_for_own' },
                ],
              },
            ],
          },
          status: 'active',
          created_at: '2023-01-10T15:06:52.658140+00:00',
          updated_at: '2023-01-10T15:06:52.658148+00:00',
        },
        userpic: {
          url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Icon_Bird_512x512.png',
        },
        info: {
          email: 'qamonite1234567890@mailnesia.com',
          phone: '+79091111111',
        },
        login: 'monite_entity_user_login_011020231906527391',
        first_name: 'Workflow',
        last_name: '',
        status: 'active',
        created_at: '2023-01-10T15:06:52.942680+00:00',
        updated_at: '2023-01-10T15:06:52.942687+00:00',
      },
      object_type: 'payable',
      policy_name: 'test',
      policy_description: 'test test test',
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: [
                'b32bbd04-72ba-43a5-b893-acd95cb10ea2',
                '0d06a2eb-da4d-4a82-b2e9-632f4384b24a',
              ],
              entity_users_to_approve: 2,
            },
          },
        },
      ],
      trigger: {
        action: 'create',
        amount: { gt: 1000, lte: 3000 },
        version: 1,
        currency: 'EUR',
        statuses: ['new'],
        object_type: 'payable',
        custom_params: {
          comes_from_email: false,
          comes_from_upload: true,
          previously_approved: false,
        },
        created_by_roles: ['2b2f7f77-dc89-47f3-b593-c85e9fd9f766'],
        created_by_users: ['b32bbd04-72ba-43a5-b893-acd95cb10ea2'],
      },
      action: 'create',
      created_at: '2023-01-10T15:06:53.424895+00:00',
      updated_at: '2023-01-10T15:06:53.424907+00:00',
    },
    {
      id: 'b01f672d-4ffb-484f-8d23-6e71570ffaad',
      created_by_entity_user: {
        id: '0d06a2eb-da4d-4a82-b2e9-632f4384b24a',
        role: {
          id: 'c0023731-0c40-4fdd-83f8-41039f7c4140',
          name: 'monite_role_011020231906566595',
          permissions: {
            objects: [
              {
                object_type: 'workflow',
                actions: [
                  { action_name: 'read', permission: 'allowed_for_own' },
                  { action_name: 'update', permission: 'allowed_for_own' },
                  { action_name: 'create', permission: 'allowed' },
                  { action_name: 'delete', permission: 'allowed_for_own' },
                ],
              },
            ],
          },
          status: 'active',
          created_at: '2023-01-10T15:06:56.399792+00:00',
          updated_at: '2023-01-10T15:06:56.399801+00:00',
        },
        userpic: null,
        info: {
          email: 'qamonite1234567890@mailnesia.com',
          phone: '+79091111111',
        },
        login: 'monite_entity_user_login_011020231906568081',
        first_name: 'Workflow',
        last_name: '',
        status: 'active',
        created_at: '2023-01-10T15:06:56.606098+00:00',
        updated_at: '2023-01-10T15:06:56.606108+00:00',
      },
      object_type: 'payable',
      policy_name: 'test',
      policy_description: null,
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_role_id',
            params: {
              entity_user_ids: ['0d06a2eb-da4d-4a82-b2e9-632f4384b24a'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'create',
        counterparts: ['bbe12a96-a09e-45ef-b407-6fc914329c32'],
        amount: { gt: 1000, lt: 10000 },
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
      },
      action: 'create',
      created_at: '2023-01-10T15:06:57.002676+00:00',
      updated_at: '2023-01-10T15:06:57.002688+00:00',
    },
    {
      id: 'db2ec5f4-cf25-478b-b353-649c76f0c924',
      created_by_entity_user: {
        id: 'b3fffb36-659e-43c2-a914-01ecd4bfea1f',
        role: {
          id: '6db32a81-5476-4973-9ca0-e02f270357e0',
          name: 'monite_role_011020231906579959',
          permissions: {
            objects: [
              {
                object_type: 'workflow',
                actions: [
                  { action_name: 'read', permission: 'allowed_for_own' },
                  { action_name: 'update', permission: 'allowed_for_own' },
                  { action_name: 'create', permission: 'allowed' },
                  { action_name: 'delete', permission: 'allowed_for_own' },
                ],
              },
            ],
          },
          status: 'active',
          created_at: '2023-01-10T15:06:57.387455+00:00',
          updated_at: '2023-01-10T15:06:57.387463+00:00',
        },
        userpic: null,
        info: {
          email: 'qamonite1234567890@mailnesia.com',
          phone: '+79091111111',
        },
        login: 'monite_entity_user_login_01102023190657687',
        first_name: 'Workflow',
        last_name: '',
        status: 'active',
        created_at: '2023-01-10T15:06:57.571139+00:00',
        updated_at: '2023-01-10T15:06:57.571147+00:00',
      },
      object_type: 'payable',
      policy_name: 'test',
      policy_description: null,
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_chain',
            params: {
              entity_user_ids: ['b3fffb36-659e-43c2-a914-01ecd4bfea1f'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'create',
        amount: { gt: 1000, lte: 15000 },
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
        tags: [
          '19e92fbb-9e4d-415c-b8fe-acb07d7af2a6',
          '673f2a63-7a41-4c44-9cc1-7ea99d73e3c6',
        ],
      },
      action: 'create',
      created_at: '2023-01-10T15:06:57.975697+00:00',
      updated_at: '2023-01-10T15:06:57.975708+00:00',
    },
    {
      id: '6428753a-7a39-4aed-998d-78585a08ff88',
      created_by_entity_user: {
        id: 'd49e6c0b-914e-4c39-b6f2-dc2b7ecc8f19',
        role: {
          id: '6fe4a53e-95d3-4598-adcb-4707a058353e',
          name: 'monite_role_011020231906587450',
          permissions: {
            objects: [
              {
                object_type: 'workflow',
                actions: [
                  { action_name: 'read', permission: 'allowed_for_own' },
                  { action_name: 'update', permission: 'allowed_for_own' },
                  { action_name: 'create', permission: 'allowed' },
                  { action_name: 'delete', permission: 'allowed_for_own' },
                ],
              },
            ],
          },
          status: 'active',
          created_at: '2023-01-10T15:06:58.323388+00:00',
          updated_at: '2023-01-10T15:06:58.323397+00:00',
        },
        userpic: null,
        info: {
          email: 'qamonite1234567890@mailnesia.com',
          phone: '+79091111111',
        },
        login: 'monite_entity_user_login_011020231906584730',
        first_name: 'Workflow',
        last_name: '',
        status: 'active',
        created_at: '2023-01-10T15:06:58.551467+00:00',
        updated_at: '2023-01-10T15:06:58.551477+00:00',
      },
      object_type: 'payable',
      policy_name: 'test',
      policy_description: null,
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: ['d49e6c0b-914e-4c39-b6f2-dc2b7ecc8f19'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'create',
        amount: { lt: 10000, gte: 1000 },
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
      },
      action: 'create',
      created_at: '2023-01-10T15:06:58.927113+00:00',
      updated_at: '2023-01-10T15:06:58.927127+00:00',
    },
    {
      id: '5ee5821a-3eba-4bf6-9db3-d332b9d313bb',
      created_by_entity_user: {
        id: 'd092bd69-0e14-4bf5-8018-462866b765f1',
        role: {
          id: '458dfe1b-8f20-4a34-b6ae-5f122eda72c4',
          name: 'monite_role_011020231906581303',
          permissions: {
            objects: [
              {
                object_type: 'workflow',
                actions: [
                  { action_name: 'read', permission: 'allowed_for_own' },
                  { action_name: 'update', permission: 'allowed_for_own' },
                  { action_name: 'create', permission: 'allowed' },
                  { action_name: 'delete', permission: 'allowed_for_own' },
                ],
              },
            ],
          },
          status: 'active',
          created_at: '2023-01-10T15:06:59.269911+00:00',
          updated_at: '2023-01-10T15:06:59.269919+00:00',
        },
        userpic: null,
        info: {
          email: 'qamonite1234567890@mailnesia.com',
          phone: '+79091111111',
        },
        login: 'monite_entity_user_login_01102023190659986',
        first_name: 'Workflow',
        last_name: '',
        status: 'active',
        created_at: '2023-01-10T15:06:59.461979+00:00',
        updated_at: '2023-01-10T15:06:59.461991+00:00',
      },
      object_type: 'payable',
      policy_name: 'test',
      policy_description: null,
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: ['d092bd69-0e14-4bf5-8018-462866b765f1'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'create',
        amount: { gte: 1000, lte: 10000 },
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
      },
      action: 'create',
      created_at: '2023-01-10T15:06:59.861425+00:00',
      updated_at: '2023-01-10T15:06:59.861441+00:00',
    },
    {
      id: '483f49e7-2540-426d-b204-eb99daec2d9a',
      created_by_entity_user: {
        id: 'cc5ef1fd-661a-4ab6-a457-540c1b65a206',
        role: {
          id: '7f98fd0d-a9c4-41f3-806c-80a1474b5383',
          name: 'monite_role_011020231918073682',
          permissions: {
            objects: [
              {
                object_type: 'workflow',
                actions: [
                  { action_name: 'read', permission: 'allowed_for_own' },
                  { action_name: 'update', permission: 'allowed_for_own' },
                  { action_name: 'create', permission: 'allowed' },
                  { action_name: 'delete', permission: 'allowed_for_own' },
                ],
              },
            ],
          },
          status: 'active',
          created_at: '2023-01-10T15:18:07.879219+00:00',
          updated_at: '2023-01-10T15:18:07.879229+00:00',
        },
        userpic: null,
        info: {
          email: 'qamonite1234567890@mailnesia.com',
          phone: '+79091111111',
        },
        login: 'monite_entity_user_login_01102023191807344',
        first_name: 'Workflow',
        last_name: '',
        status: 'active',
        created_at: '2023-01-10T15:18:08.079997+00:00',
        updated_at: '2023-01-10T15:18:08.080006+00:00',
      },
      object_type: 'payable',
      policy_name: 'test',
      policy_description: 'test test test',
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: ['cc5ef1fd-661a-4ab6-a457-540c1b65a206'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'create',
        amount: { gt: 1000, lte: 3000 },
        version: 1,
        currency: 'EUR',
        statuses: ['new'],
        object_type: 'payable',
        custom_params: {
          comes_from_email: false,
          comes_from_upload: true,
          previously_approved: false,
        },
        created_by_roles: ['7f98fd0d-a9c4-41f3-806c-80a1474b5383'],
        created_by_users: ['cc5ef1fd-661a-4ab6-a457-540c1b65a206'],
      },
      action: 'create',
      created_at: '2023-01-10T15:18:08.500785+00:00',
      updated_at: '2023-01-10T15:18:08.500797+00:00',
    },
    {
      id: '61dbc8ff-9561-40fc-940d-8eab022cead4',
      created_by_entity_user: {
        id: 'b1df205d-4c8a-4516-8edf-8af2c54eb34d',
        role: {
          id: '5e805f0d-b860-4759-9aee-1bbd9223fa92',
          name: 'monite_role_011020231918117992',
          permissions: {
            objects: [
              {
                object_type: 'workflow',
                actions: [
                  { action_name: 'read', permission: 'allowed_for_own' },
                  { action_name: 'update', permission: 'allowed_for_own' },
                  { action_name: 'create', permission: 'allowed' },
                  { action_name: 'delete', permission: 'allowed_for_own' },
                ],
              },
            ],
          },
          status: 'active',
          created_at: '2023-01-10T15:18:11.539214+00:00',
          updated_at: '2023-01-10T15:18:11.539222+00:00',
        },
        userpic: null,
        info: {
          email: 'qamonite1234567890@mailnesia.com',
          phone: '+79091111111',
        },
        login: 'monite_entity_user_login_011020231918114807',
        first_name: 'Workflow',
        last_name: '',
        status: 'active',
        created_at: '2023-01-10T15:18:11.752996+00:00',
        updated_at: '2023-01-10T15:18:11.753005+00:00',
      },
      object_type: 'payable',
      policy_name: 'test',
      policy_description: null,
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: ['b1df205d-4c8a-4516-8edf-8af2c54eb34d'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'create',
        amount: { gt: 1000, lt: 10000 },
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
      },
      action: 'create',
      created_at: '2023-01-10T15:18:12.136904+00:00',
      updated_at: '2023-01-10T15:18:12.136916+00:00',
    },
    {
      id: 'c4a2ee9f-b06c-462d-9666-0d96a3208509',
      created_by_entity_user: {
        id: '44bf50a9-eab7-49ed-95ba-b3754ae8c839',
        role: {
          id: 'e6ecc0d9-b6f7-4018-a1e0-bf596d6d3d2c',
          name: 'monite_role_011020231918125864',
          permissions: {
            objects: [
              {
                object_type: 'workflow',
                actions: [
                  { action_name: 'read', permission: 'allowed_for_own' },
                  { action_name: 'update', permission: 'allowed_for_own' },
                  { action_name: 'create', permission: 'allowed' },
                  { action_name: 'delete', permission: 'allowed_for_own' },
                ],
              },
            ],
          },
          status: 'active',
          created_at: '2023-01-10T15:18:12.498375+00:00',
          updated_at: '2023-01-10T15:18:12.498385+00:00',
        },
        userpic: null,
        info: {
          email: 'qamonite1234567890@mailnesia.com',
          phone: '+79091111111',
        },
        login: 'monite_entity_user_login_011020231918123820',
        first_name: 'Workflow',
        last_name: '',
        status: 'active',
        created_at: '2023-01-10T15:18:12.730788+00:00',
        updated_at: '2023-01-10T15:18:12.730795+00:00',
      },
      object_type: 'payable',
      policy_name: 'test',
      policy_description: null,
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: ['44bf50a9-eab7-49ed-95ba-b3754ae8c839'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'create',
        amount: { gt: 1000, lte: 15000 },
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
      },
      action: 'create',
      created_at: '2023-01-10T15:18:13.120121+00:00',
      updated_at: '2023-01-10T15:18:13.120132+00:00',
    },
    {
      id: '454f5e3f-d1c5-4d23-ba18-9b2d558e359d',
      created_by_entity_user: {
        id: 'cf9902ce-7148-4957-b6fb-dbfabe53a360',
        role: {
          id: 'd0ba6418-e401-4d79-9c7f-2d28e0785d6f',
          name: 'monite_role_011020231918134282',
          permissions: {
            objects: [
              {
                object_type: 'workflow',
                actions: [
                  { action_name: 'read', permission: 'allowed_for_own' },
                  { action_name: 'update', permission: 'allowed_for_own' },
                  { action_name: 'create', permission: 'allowed' },
                  { action_name: 'delete', permission: 'allowed_for_own' },
                ],
              },
            ],
          },
          status: 'active',
          created_at: '2023-01-10T15:18:13.467573+00:00',
          updated_at: '2023-01-10T15:18:13.467581+00:00',
        },
        userpic: null,
        info: {
          email: 'qamonite1234567890@mailnesia.com',
          phone: '+79091111111',
        },
        login: 'monite_entity_user_login_01102023191813549',
        first_name: 'Workflow',
        last_name: '',
        status: 'active',
        created_at: '2023-01-10T15:18:13.677136+00:00',
        updated_at: '2023-01-10T15:18:13.677145+00:00',
      },
      object_type: 'payable',
      policy_name: 'test',
      policy_description: null,
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: ['cf9902ce-7148-4957-b6fb-dbfabe53a360'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'create',
        amount: { lt: 10000, gte: 1000 },
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
      },
      action: 'create',
      created_at: '2023-01-10T15:18:14.150104+00:00',
      updated_at: '2023-01-10T15:18:14.150117+00:00',
    },
    {
      id: 'b2f9fb03-05a5-46cf-b4a4-1d4dcbba00f5',
      created_by_entity_user: {
        id: '3f96f049-e9ca-43de-a216-dc9961bdd86e',
        role: {
          id: 'e732f24f-778d-41b6-9c66-ce3a4d10fea8',
          name: 'monite_role_011020231918146313',
          permissions: {
            objects: [
              {
                object_type: 'workflow',
                actions: [
                  { action_name: 'read', permission: 'allowed_for_own' },
                  { action_name: 'update', permission: 'allowed_for_own' },
                  { action_name: 'create', permission: 'allowed' },
                  { action_name: 'delete', permission: 'allowed_for_own' },
                ],
              },
            ],
          },
          status: 'active',
          created_at: '2023-01-10T15:18:14.512732+00:00',
          updated_at: '2023-01-10T15:18:14.512741+00:00',
        },
        userpic: null,
        info: {
          email: 'qamonite1234567890@mailnesia.com',
          phone: '+79091111111',
        },
        login: 'monite_entity_user_login_011020231918146202',
        first_name: 'Workflow',
        last_name: '',
        status: 'active',
        created_at: '2023-01-10T15:18:14.695851+00:00',
        updated_at: '2023-01-10T15:18:14.695860+00:00',
      },
      object_type: 'payable',
      policy_name: 'test',
      policy_description: null,
      workflow: [
        {
          call: {
            method: 'Payables.request_approval_by_entity_user',
            params: {
              entity_user_ids: ['3f96f049-e9ca-43de-a216-dc9961bdd86e'],
              entity_users_to_approve: 1,
            },
          },
        },
      ],
      trigger: {
        action: 'create',
        amount: { gte: 1000, lte: 10000 },
        version: 1,
        currency: 'EUR',
        object_type: 'payable',
      },
      action: 'create',
      created_at: '2023-01-10T15:18:15.078338+00:00',
      updated_at: '2023-01-10T15:18:15.078351+00:00',
    },
  ],
  prev_pagination_token: null,
  next_pagination_token:
    'eyJvcmRlciI6ImFzYyIsImxpbWl0IjoxMCwiZmxhdF9wYWdpbmF0aW9uX2ZpbHRlcnMiOlt7ImpvaW5fdHlwZSI6IkFORCJ9LHsiam9pbl90eXBlIjoiQU5EIiwiZW50aXR5X2lkIjoiZWM3NGNlYjYtZDFlZi00ODk4LWI1YjMtZDI1MjBhNTJjMDczIiwic3RhdHVzIjoiYWN0aXZlIn0seyJqb2luX3R5cGUiOiJBTkQifV0sInBhZ2luYXRpb25fdG9rZW5fdHlwZSI6Im5leHQiLCJjdXJzb3JfZmllbGQiOm51bGwsImN1cnNvcl9maWVsZF92YWx1ZSI6bnVsbCwiY3VycmVudF9vaWQiOjIxMDUyNX0=',
};
