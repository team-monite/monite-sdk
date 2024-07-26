import { components } from '@/api';
import { entityIds } from '@/mocks/entities';
import { faker } from '@faker-js/faker';

export const createPaymentReminder = (
  paymentReminder: components['schemas']['PaymentReminder']
): components['schemas']['PaymentReminderResponse'] => ({
  ...paymentReminder,
  id: faker.string.nanoid(),
  created_at: faker.date.past().toString(),
  updated_at: faker.date.past().toString(),
  entity_id: entityIds[0],
  status: 'active',
});

export const paymentReminderListFixture: Array<
  components['schemas']['PaymentReminderResponse']
> = new Array(10).fill('_').map(() => {
  const paymentReminder: components['schemas']['PaymentReminderResponse'] = {
    id: faker.string.nanoid(),
    name: faker.lorem.word(),
    term_1_reminder: {
      days_before: faker.number.int({ min: 1, max: 10 }),
      subject: faker.lorem.sentence(),
      body: faker.lorem.sentence(),
    },
    term_2_reminder: {
      days_before: faker.number.int({ min: 1, max: 10 }),
      subject: faker.lorem.sentence(),
      body: faker.lorem.sentence(),
    },
    term_final_reminder: {
      days_before: faker.number.int({ min: 1, max: 10 }),
      subject: faker.lorem.sentence(),
      body: faker.lorem.sentence(),
    },
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    entity_id: entityIds[0],
    status: 'active',
  };

  return paymentReminder;
});
