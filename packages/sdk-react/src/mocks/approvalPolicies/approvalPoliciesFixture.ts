import {
  entityUser2,
  entityUser3,
  entityUser4,
  entityUser5,
} from '@/mocks/entityUsers/entityUserByIdFixture';
import {
  ApprovalPolicyResource,
  ApprovalPolicyResourceList,
  ApprovalPolicyStatus,
} from '@monite/sdk-api';

export const approvalPoliciesSearchFixture: ApprovalPolicyResourceList = {
  data: [
    {
      id: '2b659d98-61db-491e-9d74-901c704dd1db',
      status: ApprovalPolicyStatus.ACTIVE,
      name: 'Via script',
      script: [
        {
          call: 'ApprovalRequests.request_approval_by_users',
        },
      ],
      trigger: {
        all: [
          "{event_name == 'submit_for_approval'}",
          '{invoice.amount >= 50000}',
        ],
      },
      description:
        'Approval of two users required for any payables over 500 worth',
      created_at: '2023-05-17T11:54:28.189950+00:00',
      updated_at: '2023-05-17T11:54:28.189969+00:00',
      created_by: entityUser3.id,
      updated_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
    },
    {
      id: 'c640f3ae-f264-43c9-9030-37a66486aa9a',
      status: ApprovalPolicyStatus.ACTIVE,
      script: [],
      name: 'Amount trigger',
      description: 'Invoice amount description',
      created_at: '2023-05-19T14:02:00.523364+00:00',
      updated_at: '2023-05-19T14:02:00.523381+00:00',
      created_by: entityUser2.id,
      updated_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
    },
    {
      id: '7e0ebd74-834d-45e0-839d-5d7799c87da8',
      status: ApprovalPolicyStatus.ACTIVE,
      name: 'Counterparts trigger',
      script: [],
      description: 'For invoice counterparts that are on the list',
      created_at: '2023-05-22T04:38:03.303878+00:00',
      updated_at: '2023-05-22T04:38:03.303890+00:00',
      created_by: entityUser4.id,
      updated_by: entityUser2.id,
    },
    {
      id: 'bdc78ca0-202c-44c1-abca-4b21b1323801',
      status: ApprovalPolicyStatus.ACTIVE,
      name: 'Currency trigger',
      script: [],
      description:
        'For an invoice currency in some range (an invoice with EURO & USD)',
      created_at: '2023-05-22T04:38:44.013458+00:00',
      updated_at: '2023-05-22T04:38:44.013476+00:00',
      created_by: entityUser5.id,
      updated_by: entityUser5.id,
    },
    {
      id: 'cab0f116-9958-4ca3-b87a-9e594d4e6edf',
      status: ApprovalPolicyStatus.ACTIVE,
      name: 'Many triggers',
      script: [],
      description: 'For an invoice that was created by users',
      created_at: '2023-05-22T04:39:31.877719+00:00',
      updated_at: '2023-05-22T04:39:31.877740+00:00',
      created_by: entityUser5.id,
      updated_by: entityUser5.id,
    },
    {
      id: '1344aec8-e2b9-4d91-b95b-ad6f403d3983',
      status: ApprovalPolicyStatus.ACTIVE,
      name: 'Tags trigger',
      script: [],
      description: 'For an invoice with some specific tags',
      created_at: '2023-05-22T11:11:18.350945+00:00',
      updated_at: '2023-05-22T11:11:18.350964+00:00',
      created_by: entityUser2.id,
      updated_by: entityUser5.id,
    },
  ],
  prev_pagination_token: undefined,
  next_pagination_token: undefined,
};

export const approvalPolicyByIdFixtures: Array<ApprovalPolicyResource> = [
  {
    id: '2b659d98-61db-491e-9d74-901c704dd1db',
    name: 'Sample approval policy',
    description:
      'Approval of two users required for any payables over 500 worth',
    script: [
      {
        call: 'ApprovalRequests.request_approval_by_users',
        params: {
          user_ids: ['5b4daced-6b9a-4707-83c6-08193d999fab'],
          required_approval_count: 2,
        },
      },
    ],
    trigger: {
      all: [
        "{event_name == 'submit_for_approval'}",
        '{invoice.amount >= 50000}',
      ],
    },
    status: ApprovalPolicyStatus.ACTIVE,
    created_at: '2023-05-17T11:54:28.189950+00:00',
    updated_at: '2023-05-17T11:54:28.189969+00:00',
    created_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
    updated_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
  },
  {
    id: 'c640f3ae-f264-43c9-9030-37a66486aa9a',
    name: 'Invoice amount trigger',
    description: 'Invoice amount description',
    script: [
      {
        any: [
          {
            call: 'ApprovalRequests.request_approval_by_users',
            params: {
              user_ids: [
                '398b2748-b255-46da-b8dc-a01219539ec7',
                '398b2748-b255-46da-b8dc-a01219539ec8',
                '398b2748-b255-46da-b8dc-a01219539ec9',
              ],
              required_approval_count: 2,
            },
          },
          {
            call: 'ApprovalRequests.request_approval_by_roles',
            params: {
              role_ids: ['398b2748-b255-46da-b8dc-a01219539ec8'],
              required_approval_count: 1,
            },
          },
        ],
      },
      '{Payables.approve(invoice.id)}',
    ],
    trigger: {
      all: [
        {
          operator: '>',
          left_operand: {
            name: 'invoice.amount',
          },
          right_operand: 300,
        },
      ],
    },
    status: ApprovalPolicyStatus.ACTIVE,
    created_at: '2023-05-19T14:02:00.523364+00:00',
    updated_at: '2023-05-19T14:02:00.523381+00:00',
    created_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
    updated_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
  },
  {
    name: 'For invoice counterparts',
    description: 'For invoice counterparts that are on the list',
    script: [
      {
        call: 'ApprovalRequests.request_approval_by_roles',
        params: {
          role_ids: ['398b2748-b255-46da-b8dc-a01219539ec8'],
          required_approval_count: 1,
        },
      },
    ],
    trigger: {
      all: [
        {
          operator: '==',
          left_operand: {
            name: 'event_name',
          },
          right_operand: 'submitted_for_approval',
        },
        {
          operator: 'in',
          left_operand: 'invoice.counterpart_id',
          right_operand: [
            '398b2748-b255-46da-b8dc-a01219539ec8',
            '398b2748-b255-46da-b8dc-a01219539ec9',
          ],
        },
      ],
    },
    id: '7e0ebd74-834d-45e0-839d-5d7799c87da8',
    status: ApprovalPolicyStatus.ACTIVE,
    created_at: '2023-05-22T04:38:03.303878+00:00',
    updated_at: '2023-05-22T04:38:03.303890+00:00',
    created_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
    updated_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
  },
  {
    name: 'For an invoice currency',
    description:
      'For an invoice currency in some range (an invoice with EURO & USD)',
    script: [],
    trigger: {
      all: [
        {
          operator: '==',
          left_operand: {
            name: 'event_name',
          },
          right_operand: 'submitted_for_approval',
        },
        {
          operator: 'in',
          left_operand: {
            name: 'invoice.currency',
          },
          right_operand: ['EUR', 'USD'],
        },
      ],
    },
    id: 'bdc78ca0-202c-44c1-abca-4b21b1323801',
    status: ApprovalPolicyStatus.ACTIVE,
    created_at: '2023-05-22T04:38:44.013458+00:00',
    updated_at: '2023-05-22T04:38:44.013476+00:00',
    created_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
    updated_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
  },
  {
    name: 'For an invoice that was created by users',
    description: 'For an invoice that was created by users',
    script: [
      {
        call: 'ApprovalRequests.request_approval_by_users',
        params: {
          user_ids: [
            '91bff192-1a13-4a13-a4da-a2945ed0537d',
            'ae6e88a8-c088-428c-ace2-d657bf407805',
            'c2daca46-c0cb-45a3-a3a2-bfb1e768104c',
          ],
          required_approval_count: 1,
        },
      },
    ],
    trigger: {
      all: [
        {
          operator: '==',
          left_operand: {
            name: 'event_name',
          },
          right_operand: 'submitted_for_approval',
        },
        {
          operator: 'in',
          left_operand: {
            name: 'invoice.was_created_by_user_id',
          },
          right_operand: [
            'd566f374-463a-4a07-b252-2eb0200d62ce',
            '398b2748-b255-46da-b8dc-a01219539ec9',
          ],
        },
        {
          operator: 'in',
          left_operand: {
            name: 'invoice.currency',
          },
          right_operand: ['EUR', 'USD'],
        },
        {
          operator: 'in',
          left_operand: 'invoice.counterpart_id',
          right_operand: [
            '398b2748-b255-46da-b8dc-a01219539ec8',
            '398b2748-b255-46da-b8dc-a01219539ec9',
          ],
        },
        {
          operator: '>',
          left_operand: {
            name: 'invoice.amount',
          },
          right_operand: 300,
        },
      ],
    },
    id: 'cab0f116-9958-4ca3-b87a-9e594d4e6edf',
    status: ApprovalPolicyStatus.ACTIVE,
    created_at: '2023-05-22T04:39:31.877719+00:00',
    updated_at: '2023-05-22T04:39:31.877740+00:00',
    created_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
    updated_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
  },
  {
    name: 'For an invoice that was created with tags',
    description: 'For an invoice with some specific tags',
    script: [
      {
        all: [
          {
            call: 'ApprovalRequests.request_approval_by_users',
            params: {
              user_ids: [
                '398b2748-b255-46da-b8dc-a01219539ec7',
                '398b2748-b255-46da-b8dc-a01219539ec8',
                '398b2748-b255-46da-b8dc-a01219539ec9',
              ],
              required_approval_count: 2,
            },
          },
          {
            call: 'ApprovalRequests.request_approval_by_roles',
            params: {
              role_ids: ['398b2748-b255-46da-b8dc-a01219539ec8'],
              required_approval_count: 1,
            },
          },
        ],
      },
      '{Payables.approve(invoice.id)}',
    ],
    trigger: {
      all: [
        {
          operator: 'in',
          left_operand: {
            name: 'invoice.tags',
          },
          right_operand: [
            'd566f374-463a-4a07-b252-2eb0200d62ce',
            '398b2748-b255-46da-b8dc-a01219539ec9',
          ],
        },
      ],
    },
    id: '1344aec8-e2b9-4d91-b95b-ad6f403d3983',
    status: ApprovalPolicyStatus.ACTIVE,
    created_at: '2023-05-22T11:11:18.350945+00:00',
    updated_at: '2023-05-22T11:11:18.350964+00:00',
    created_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
    updated_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
  },
];
