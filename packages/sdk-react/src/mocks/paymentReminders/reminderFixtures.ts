import { components } from '@/api';
import { entityIds } from '@/mocks/entities';
import { faker } from '@faker-js/faker';

export const paymentReminderListFixture: components['schemas']['PaymentReminderResponse'][] =
  new Array(15).fill('_').map(() => ({
    id: faker.string.nanoid(),
    name: 'payment_reminder',
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    entity_id: entityIds[0],
    status: faker.datatype.boolean() ? 'active' : 'deleted',
  }));

export const overdueReminderListFixture: components['schemas']['OverdueReminderResponse'][] =
  new Array(15).fill('_').map(() => ({
    id: faker.string.nanoid(),
    name: 'overdue_reminder',
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
  }));
