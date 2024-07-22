import { components } from '@/api';
import { entityIds } from '@/mocks/entities';
import { faker } from '@faker-js/faker';

export const getPaymentReminder: components['schemas']['PaymentReminderResponse'] =
  {
    name: 'payment_reminder',
    id: faker.string.nanoid(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    entity_id: entityIds[0],
    status: faker.datatype.boolean() ? 'active' : 'deleted',
  };

export const getOverdueReminder: components['schemas']['PaymentReminderResponse'] =
  {
    name: 'overdue_reminder',
    id: faker.string.nanoid(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    entity_id: entityIds[0],
    status: faker.datatype.boolean() ? 'active' : 'deleted',
  };
