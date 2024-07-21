import { components } from '@/api';
import { entityIds } from '@/mocks/entities';
import { faker } from '@faker-js/faker';

export const getPaymentReminder = (
  paymentReminder: components['schemas']['PaymentReminder']
): components['schemas']['PaymentReminderResponse'] => ({
  ...paymentReminder,
  id: faker.string.nanoid(),
  created_at: faker.date.past().toString(),
  updated_at: faker.date.past().toString(),
  entity_id: entityIds[0],
  status: faker.datatype.boolean() ? 'active' : 'deleted',
});

export const getOverdueReminder = (
  paymentReminder: components['schemas']['OverdueReminderRequest']
): components['schemas']['PaymentReminderResponse'] => ({
  ...paymentReminder,
  id: faker.string.nanoid(),
  created_at: faker.date.past().toString(),
  updated_at: faker.date.past().toString(),
  entity_id: entityIds[0],
  status: faker.datatype.boolean() ? 'active' : 'deleted',
});
