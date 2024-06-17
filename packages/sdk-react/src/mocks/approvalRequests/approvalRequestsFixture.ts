import type { components, Services } from '@/api';
import { entityUserByIdFixture } from '@/mocks/entityUsers/entityUserByIdFixture';
import { faker } from '@faker-js/faker';

export const approvalRequestsListFixture: Services['approvalRequests']['getApprovalRequests']['types']['data']['data'] =
  new Array(130).fill('_').map((_) => ({
    id: faker.string.nanoid(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    approved_by: [entityUserByIdFixture.id],
    created_by: entityUserByIdFixture.id,
    object_id: faker.string.nanoid(),
    object_type: 'payable' as components['schemas']['ObjectType'],
    required_approval_count: 1,
    role_ids: [],
    status: faker.helpers.arrayElement([
      'waiting',
      'approved',
      'rejected',
      'canceled',
    ]) as components['schemas']['ApprovalRequestStatus'],
    user_ids: [entityUserByIdFixture.id],
  }));
