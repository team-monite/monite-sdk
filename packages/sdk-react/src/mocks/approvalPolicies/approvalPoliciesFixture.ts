import { components } from '@/api';
import {
  individualId,
  organizationId,
} from '@/mocks/counterparts/counterpart.mocks.types';
import {
  entityUserByIdFixture,
  entityUser2,
  entityUser3,
  entityUser4,
  entityUser5,
} from '@/mocks/entityUsers/entityUserByIdFixture';
import {
  FULL_PERMISSION_ROLE_ID,
  LOW_PERMISSION_ROLE_ID,
  READ_ONLY_ROLE_ID,
} from '@/mocks/roles/rolesFixtures';
import { tagListFixture } from '@/mocks/tags';

export const approvalPoliciesListFixture: components['schemas']['ApprovalPolicyResourceList'] =
  {
    data: [
      {
        name: 'Approval policy with all conditions and flows',
        description:
          'For an invoice that was created by users, has tags, from he list of counterparts, has amount and should be approved by single user, anyone from the list, any from list of roles, and users with chain order',
        // @ts-expect-error - `trigger` is not covered by the schema
        trigger: {
          all: [
            "{event_name == 'submit_for_approval'}",
            {
              operator: 'in',
              left_operand: {
                name: 'invoice.was_created_by_user_id',
              },
              right_operand: [entityUserByIdFixture.id, entityUser2.id],
            },
            {
              operator: 'in',
              left_operand: {
                name: 'invoice.tags.id',
              },
              right_operand: [
                tagListFixture[0].id,
                tagListFixture[2].id,
                tagListFixture[3].id,
              ],
            },
            {
              operator: 'in',
              left_operand: {
                name: 'invoice.counterpart_id',
              },
              right_operand: [organizationId, individualId],
            },
            {
              operator: '>=',
              left_operand: {
                name: 'invoice.amount',
              },
              right_operand: 30000,
            },
            {
              operator: '<=',
              left_operand: {
                name: 'invoice.amount',
              },
              right_operand: '50000',
            },
            {
              operator: 'in',
              left_operand: {
                name: 'invoice.currency',
              },
              right_operand: 'EUR',
            },
          ],
        },

        script: [
          // @ts-expect-error - `script` is not covered by the schema
          {
            run_concurrently: true,
            all: [
              {
                call: 'ApprovalRequests.request_approval_by_users',
                params: {
                  user_ids: [entityUserByIdFixture.id],
                  required_approval_count: 1,
                },
              },
              {
                call: 'ApprovalRequests.request_approval_by_users',
                params: {
                  user_ids: [
                    entityUserByIdFixture.id,
                    entityUser2.id,
                    entityUser3.id,
                  ],
                  required_approval_count: 2,
                },
              },
              {
                run_concurrently: false,
                all: [
                  {
                    call: 'ApprovalRequests.request_approval_by_users',
                    params: {
                      user_ids: [entityUser2.id],
                      required_approval_count: 1,
                    },
                  },
                  {
                    call: 'ApprovalRequests.request_approval_by_users',
                    params: {
                      user_ids: [entityUser3.id],
                      required_approval_count: 1,
                    },
                  },
                ],
              },
              {
                call: 'ApprovalRequests.request_approval_by_roles',
                params: {
                  role_ids: [
                    FULL_PERMISSION_ROLE_ID,
                    LOW_PERMISSION_ROLE_ID,
                    READ_ONLY_ROLE_ID,
                  ],
                  required_approval_count: 2,
                },
              },
            ],
          },
        ],
        id: 'approval-policy-id-created-by-approve-anyone',
        status: 'active',
        created_at: '2023-05-22T04:39:31.877719+00:00',
        updated_at: '2023-05-22T04:39:31.877740+00:00',
        created_by: entityUser3.id,
        updated_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
      },
      {
        id: '2b659d98-61db-491e-9d74-901c704dd1db',
        name: 'Created by user and single user',
        description: 'Created by user and single user',
        // @ts-expect-error - `trigger` is not covered by the schema
        trigger: {
          all: [
            "{event_name == 'submit_for_approval'}",
            {
              operator: 'in',
              left_operand: {
                name: 'invoice.was_created_by_user_id',
              },
              right_operand: [entityUserByIdFixture.id, entityUser2.id],
            },
          ],
        },
        script: [
          // @ts-expect-error - `script` is not covered by the schema
          {
            run_concurrently: true,
            all: [
              {
                call: 'ApprovalRequests.request_approval_by_users',
                params: {
                  user_ids: [entityUserByIdFixture.id],
                  required_approval_count: 1,
                },
              },
            ],
          },
        ],
        status: 'active',
        created_at: '2023-05-17T11:54:28.189950+00:00',
        updated_at: '2023-05-17T11:54:28.189969+00:00',
        created_by: entityUser3.id,
        updated_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
      },
      {
        id: 'c640f3ae-f264-43c9-9030-37a66486aa9a',
        name: 'Has tags and approved by users from the list',
        description: 'Has tags and approved by users from the list',
        // @ts-expect-error - `trigger` is not covered by the schema
        trigger: {
          all: [
            {
              operator: 'in',
              left_operand: {
                name: 'invoice.tags.id',
              },
              right_operand: [
                tagListFixture[0].id,
                tagListFixture[2].id,
                tagListFixture[3].id,
              ],
            },
          ],
        },
        script: [
          // @ts-expect-error - `script` is not covered by the schema
          {
            run_concurrently: true,
            all: [
              {
                call: 'ApprovalRequests.request_approval_by_users',
                params: {
                  user_ids: [
                    entityUserByIdFixture.id,
                    entityUser2.id,
                    entityUser3.id,
                  ],
                  required_approval_count: 2,
                },
              },
            ],
          },
        ],
        status: 'active',
        created_at: '2023-05-19T14:02:00.523364+00:00',
        updated_at: '2023-05-19T14:02:00.523381+00:00',
        created_by: entityUser2.id,
        updated_by: '5b4daced-6b9a-4707-83c6-08193d999fab',
      },
      {
        name: 'By counterparts and approved by users chain',
        description: 'By counterparts and approved by users chain',
        // @ts-expect-error - `trigger` is not covered by the schema
        trigger: {
          all: [
            "{event_name == 'submit_for_approval'}",
            {
              operator: 'in',
              left_operand: {
                name: 'invoice.counterpart_id',
              },
              right_operand: [organizationId, individualId],
            },
          ],
        },
        script: [
          // @ts-expect-error - `script` is not covered by the schema
          {
            run_concurrently: true,
            all: [
              {
                run_concurrently: false,
                all: [
                  {
                    call: 'ApprovalRequests.request_approval_by_users',
                    params: {
                      user_ids: [entityUser2.id],
                      required_approval_count: 1,
                    },
                  },
                  {
                    call: 'ApprovalRequests.request_approval_by_users',
                    params: {
                      user_ids: [entityUser3.id],
                      required_approval_count: 1,
                    },
                  },
                ],
              },
            ],
          },
        ],
        id: '7e0ebd74-834d-45e0-839d-5d7799c87da8',
        status: 'active',
        created_at: '2023-05-22T04:38:03.303878+00:00',
        updated_at: '2023-05-22T04:38:03.303890+00:00',
        created_by: entityUser4.id,
        updated_by: entityUser2.id,
      },
      {
        name: 'For amount and approved by roles',
        description: 'For amount and approved by roles',
        // @ts-expect-error - `trigger` is not covered by the schema
        trigger: {
          all: [
            "{event_name == 'submit_for_approval'}",
            {
              operator: '>=',
              left_operand: {
                name: 'invoice.amount',
              },
              right_operand: 30000,
            },
            {
              operator: '<=',
              left_operand: {
                name: 'invoice.amount',
              },
              right_operand: '50000',
            },
            {
              operator: 'in',
              left_operand: {
                name: 'invoice.currency',
              },
              right_operand: 'EUR',
            },
          ],
        },
        script: [
          // @ts-expect-error - `script` is not covered by the schema
          {
            run_concurrently: true,
            all: [
              {
                call: 'ApprovalRequests.request_approval_by_roles',
                params: {
                  role_ids: [
                    FULL_PERMISSION_ROLE_ID,
                    LOW_PERMISSION_ROLE_ID,
                    READ_ONLY_ROLE_ID,
                  ],
                  required_approval_count: 2,
                },
              },
            ],
          },
        ],
        id: 'cab0f116-9958-4ca3-b87a-9e594d4e6edf',
        status: 'active',
        created_at: '2023-05-22T04:39:31.877719+00:00',
        updated_at: '2023-05-22T04:39:31.877740+00:00',
        created_by: entityUser5.id,
        updated_by: entityUser5.id,
      },
    ],
    prev_pagination_token: undefined,
    next_pagination_token: undefined,
  };
