import type { components, Services } from '@/api';
import {
  entityUserByIdFixture,
  entityUsers,
} from '@/mocks/entityUsers/entityUserByIdFixture';
import { getRandomProperty } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';

export const approvalRequestsListFixture: Services['approvalRequests']['getApprovalRequests']['types']['data']['data'] =
  new Array(130).fill('_').map((_) => ({
    id: faker.string.nanoid(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    approved_by: [],
    created_by: getRandomProperty(entityUsers).id,
    object_id: faker.string.nanoid(),
    object_type: 'payable' as components['schemas']['ObjectType'],
    required_approval_count: 1,
    role_ids: [],
    status: faker.helpers.arrayElement([
      'waiting',
      'approved',
      'rejected',
      'canceled',
    ]),
    user_ids: [entityUserByIdFixture.id, faker.string.nanoid()],
  }));
