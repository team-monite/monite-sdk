export const entityUsersFixture = {
  data: [
    {
      id: '5b4daced-6b9a-4707-83c6-08193d999fab',
      role: {
        id: 'ee9d2c66-48a9-4b0a-9c28-6c1c2793e067',
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
              ],
            },
            {
              object_type: 'workflow',
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
            },
            {
              object_type: 'entity',
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
            },
            {
              object_type: 'entity_user',
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
            },
            {
              object_type: 'entity_bank_account',
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
            },
            {
              object_type: 'comment',
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
              ],
            },
            {
              object_type: 'export',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
              ],
            },
            {
              object_type: 'tag',
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
                {
                  action_name: 'read',
                  permission: 'allowed',
                },
                {
                  action_name: 'read',
                  permission: 'allowed',
                },
              ],
            },
            {
              object_type: 'counterpart',
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
                  action_name: 'delete',
                  permission: 'allowed',
                },
                {
                  action_name: 'update',
                  permission: 'allowed',
                },
              ],
            },
            {
              object_type: 'receivable',
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
                  action_name: 'delete',
                  permission: 'allowed',
                },
                {
                  action_name: 'update',
                  permission: 'allowed',
                },
              ],
            },
          ],
        },
        status: 'active',
        created_at: '2022-08-30T13:37:09.358621+00:00',
        updated_at: '2022-10-21T12:19:55.162277+00:00',
      },
      userpic: {
        url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Icon_Bird_512x512.png',
      },
      info: {
        email: null,
        phone: null,
      },
      login: 'monite_entity_user_login_083020221631434735',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2022-08-30T13:31:43.971531+00:00',
      updated_at: '2023-01-11T18:11:12.340654+00:00',
    },
    {
      id: 'b403a614-45a4-421e-9eb1-79fe7efaf50e',
      role: null,
      userpic: {
        url: 'https://cdn-icons-png.flaticon.com/512/1303/1303472.png',
      },
      info: {
        email: 'qa-team@monite.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_112320220151258832',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2022-11-22T21:51:26.154787+00:00',
      updated_at: '2022-11-22T21:51:26.154804+00:00',
    },
    {
      id: '6d85a8d1-4b71-4823-93d0-c0fc263f0485',
      role: null,
      userpic: { url: 'https://cdn-icons-png.flaticon.com/512/616/616554.png' },
      info: {
        email: 'qa-team@monite.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_112320220154153339',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2022-11-22T21:54:15.913683+00:00',
      updated_at: '2022-11-22T21:54:15.913695+00:00',
    },
    {
      id: 'e7646f0e-b5d6-4dc1-a4b0-ceea3b3add68',
      role: null,
      userpic: null,
      info: {
        email: 'qa-team@monite.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_112320220154164476',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2022-11-22T21:54:17.061866+00:00',
      updated_at: '2022-11-22T21:54:17.061875+00:00',
    },
    {
      id: 'd5df774a-1ca7-403f-ae31-75d7f6fc564f',
      role: null,
      userpic: null,
      info: {
        email: 'qa-team@monite.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_112320220154177560',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2022-11-22T21:54:18.296763+00:00',
      updated_at: '2022-11-22T21:54:18.296777+00:00',
    },
    {
      id: '590384b8-3254-4e78-bc9d-bc6924dba2ad',
      role: null,
      userpic: null,
      info: {
        email: 'qa-team@monite.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_112320220154195145',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2022-11-22T21:54:19.430158+00:00',
      updated_at: '2022-11-22T21:54:19.430180+00:00',
    },
    {
      id: 'b32bbd04-72ba-43a5-b893-acd95cb10ea2',
      role: {
        id: '2b2f7f77-dc89-47f3-b593-c85e9fd9f766',
        name: 'monite_role_01102023190652203',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
              ],
            },
          ],
        },
        status: 'active',
        created_at: '2023-01-10T15:06:52.658140+00:00',
        updated_at: '2023-01-10T15:06:52.658148+00:00',
      },
      userpic: null,
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
    {
      id: '0d06a2eb-da4d-4a82-b2e9-632f4384b24a',
      role: {
        id: 'c0023731-0c40-4fdd-83f8-41039f7c4140',
        name: 'monite_role_011020231906566595',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
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
    {
      id: 'b3fffb36-659e-43c2-a914-01ecd4bfea1f',
      role: {
        id: '6db32a81-5476-4973-9ca0-e02f270357e0',
        name: 'monite_role_011020231906579959',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
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
    {
      id: 'd49e6c0b-914e-4c39-b6f2-dc2b7ecc8f19',
      role: {
        id: '6fe4a53e-95d3-4598-adcb-4707a058353e',
        name: 'monite_role_011020231906587450',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
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
    {
      id: 'd092bd69-0e14-4bf5-8018-462866b765f1',
      role: {
        id: '458dfe1b-8f20-4a34-b6ae-5f122eda72c4',
        name: 'monite_role_011020231906581303',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
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
    {
      id: '5395e758-673d-48b6-a9b7-366161467680',
      role: null,
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231907038985',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:07:04.192252+00:00',
      updated_at: '2023-01-10T15:07:04.192266+00:00',
    },
    {
      id: 'cc5ef1fd-661a-4ab6-a457-540c1b65a206',
      role: {
        id: '7f98fd0d-a9c4-41f3-806c-80a1474b5383',
        name: 'monite_role_011020231918073682',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
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
    {
      id: 'b1df205d-4c8a-4516-8edf-8af2c54eb34d',
      role: {
        id: '5e805f0d-b860-4759-9aee-1bbd9223fa92',
        name: 'monite_role_011020231918117992',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
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
    {
      id: '44bf50a9-eab7-49ed-95ba-b3754ae8c839',
      role: {
        id: 'e6ecc0d9-b6f7-4018-a1e0-bf596d6d3d2c',
        name: 'monite_role_011020231918125864',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
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
    {
      id: 'cf9902ce-7148-4957-b6fb-dbfabe53a360',
      role: {
        id: 'd0ba6418-e401-4d79-9c7f-2d28e0785d6f',
        name: 'monite_role_011020231918134282',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
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
    {
      id: '3f96f049-e9ca-43de-a216-dc9961bdd86e',
      role: {
        id: 'e732f24f-778d-41b6-9c66-ce3a4d10fea8',
        name: 'monite_role_011020231918146313',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
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
    {
      id: 'abca781c-61b2-4592-9bd5-6a62ddfccf63',
      role: null,
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231918183242',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:18:19.131325+00:00',
      updated_at: '2023-01-10T15:18:19.131341+00:00',
    },
    {
      id: 'fde57bd6-8d4b-4db3-bc36-5822b30bc5ea',
      role: {
        id: '03735e61-838e-445f-b1ac-0599f9844333',
        name: 'monite_role_011020231943126243',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
              ],
            },
          ],
        },
        status: 'active',
        created_at: '2023-01-10T15:43:12.991059+00:00',
        updated_at: '2023-01-10T15:43:12.991068+00:00',
      },
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231943128695',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:43:13.176040+00:00',
      updated_at: '2023-01-10T15:43:13.176052+00:00',
    },
    {
      id: '123687d9-56df-4a2a-b2d0-3db1e67c223f',
      role: {
        id: '5db6160c-f479-40f2-b43a-ad75c11b8a7e',
        name: 'monite_role_011020231943165192',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
              ],
            },
          ],
        },
        status: 'active',
        created_at: '2023-01-10T15:43:16.637295+00:00',
        updated_at: '2023-01-10T15:43:16.637304+00:00',
      },
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231943168139',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:43:16.849459+00:00',
      updated_at: '2023-01-10T15:43:16.849468+00:00',
    },
    {
      id: '768c04bf-45c5-4769-af31-e02cffc6ba54',
      role: {
        id: '17e5e132-b892-4a46-814c-0e94aa5fe897',
        name: 'monite_role_011020231943171749',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
              ],
            },
          ],
        },
        status: 'active',
        created_at: '2023-01-10T15:43:17.623655+00:00',
        updated_at: '2023-01-10T15:43:17.623663+00:00',
      },
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231943173932',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:43:17.810148+00:00',
      updated_at: '2023-01-10T15:43:17.810158+00:00',
    },
    {
      id: '6b12b719-f1b5-42df-af94-99c893db8fc3',
      role: {
        id: '964d64e4-24a1-40d9-bfc5-340aec36acfa',
        name: 'monite_role_011020231943189884',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
              ],
            },
          ],
        },
        status: 'active',
        created_at: '2023-01-10T15:43:18.592971+00:00',
        updated_at: '2023-01-10T15:43:18.592980+00:00',
      },
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231943188136',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:43:18.791251+00:00',
      updated_at: '2023-01-10T15:43:18.791259+00:00',
    },
    {
      id: 'a7499425-7beb-44c2-ad39-f984afbe1907',
      role: {
        id: '2dbe25dc-3fd8-4ea0-98ec-af25f151280f',
        name: 'monite_role_011020231943197061',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
              ],
            },
          ],
        },
        status: 'active',
        created_at: '2023-01-10T15:43:19.623794+00:00',
        updated_at: '2023-01-10T15:43:19.623806+00:00',
      },
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231943196167',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:43:19.821227+00:00',
      updated_at: '2023-01-10T15:43:19.821237+00:00',
    },
    {
      id: 'e9790438-6107-485d-bf41-741e42519f3f',
      role: null,
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231943241319',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:43:24.429467+00:00',
      updated_at: '2023-01-10T15:43:24.429483+00:00',
    },
    {
      id: '0babd613-92b3-4fe9-a0cd-ed195184f3b8',
      role: {
        id: 'e5b50279-b701-4137-9a05-c74795f440fb',
        name: 'monite_role_011020231944423653',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
              ],
            },
          ],
        },
        status: 'active',
        created_at: '2023-01-10T15:44:42.283445+00:00',
        updated_at: '2023-01-10T15:44:42.283455+00:00',
      },
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231944425282',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:44:42.478475+00:00',
      updated_at: '2023-01-10T15:44:42.478487+00:00',
    },
    {
      id: 'e5dbc372-689a-4165-a206-b630933c6e9f',
      role: {
        id: '156f912e-9a7c-4692-a935-c2f88eb48e73',
        name: 'monite_role_011020231944459611',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
              ],
            },
          ],
        },
        status: 'active',
        created_at: '2023-01-10T15:44:46.019976+00:00',
        updated_at: '2023-01-10T15:44:46.019988+00:00',
      },
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231944458365',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:44:46.231693+00:00',
      updated_at: '2023-01-10T15:44:46.231704+00:00',
    },
    {
      id: 'aa50f111-09b6-443f-877b-8e5ec9287d70',
      role: {
        id: '41e4aebd-c947-4266-9b21-5b3785a4a47a',
        name: 'monite_role_011020231944467961',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
              ],
            },
          ],
        },
        status: 'active',
        created_at: '2023-01-10T15:44:46.964046+00:00',
        updated_at: '2023-01-10T15:44:46.964054+00:00',
      },
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231944461405',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:44:47.148414+00:00',
      updated_at: '2023-01-10T15:44:47.148423+00:00',
    },
    {
      id: 'dd9ffeea-0199-4250-a62e-4b7c65cb61a8',
      role: {
        id: 'c3b31b19-4b73-4ac4-8016-2918270b2e12',
        name: 'monite_role_011020231944472705',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
              ],
            },
          ],
        },
        status: 'active',
        created_at: '2023-01-10T15:44:47.940791+00:00',
        updated_at: '2023-01-10T15:44:47.940804+00:00',
      },
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231944478006',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:44:48.138374+00:00',
      updated_at: '2023-01-10T15:44:48.138382+00:00',
    },
    {
      id: '36a7f661-2688-4662-8f35-fc2b879e936e',
      role: {
        id: '07cc2643-059f-42dd-93c1-2c8e81972199',
        name: 'monite_role_011020231944489712',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
              ],
            },
          ],
        },
        status: 'active',
        created_at: '2023-01-10T15:44:48.925499+00:00',
        updated_at: '2023-01-10T15:44:48.925509+00:00',
      },
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231944485202',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:44:49.121406+00:00',
      updated_at: '2023-01-10T15:44:49.121416+00:00',
    },
    {
      id: 'ae21961d-379b-4801-891f-484c7c253543',
      role: null,
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231944537737',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:44:54.191400+00:00',
      updated_at: '2023-01-10T15:44:54.191418+00:00',
    },
    {
      id: '57c5f86a-9a6f-4168-8c75-eef20722d332',
      role: {
        id: '81bc7ed5-7f15-47dc-8487-59430a9e34cc',
        name: 'monite_role_01102023194713782',
        permissions: {
          objects: [
            {
              object_type: 'workflow',
              actions: [
                {
                  action_name: 'read',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'update',
                  permission: 'allowed_for_own',
                },
                {
                  action_name: 'create',
                  permission: 'allowed',
                },
                {
                  action_name: 'delete',
                  permission: 'allowed_for_own',
                },
              ],
            },
          ],
        },
        status: 'active',
        created_at: '2023-01-10T15:47:14.111685+00:00',
        updated_at: '2023-01-10T15:47:14.111693+00:00',
      },
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231947143912',
      first_name: 'Workflow',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:47:14.311998+00:00',
      updated_at: '2023-01-10T15:47:14.312006+00:00',
    },
    {
      id: '89774817-19a6-47bd-be15-368b9d9f2b2e',
      role: null,
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231947173960',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:47:17.243485+00:00',
      updated_at: '2023-01-10T15:47:17.243499+00:00',
    },
    {
      id: '200475c0-b019-4002-9710-a683beff958e',
      role: null,
      userpic: null,
      info: {
        email: 'qamonite1234567890@mailnesia.com',
        phone: '+79091111111',
      },
      login: 'monite_entity_user_login_011020231947171005',
      first_name: 'Test',
      last_name: '',
      status: 'active',
      created_at: '2023-01-10T15:47:17.884898+00:00',
      updated_at: '2023-01-10T15:47:17.884914+00:00',
    },
  ],
  prev_pagination_token: null,
  next_pagination_token: null,
};
