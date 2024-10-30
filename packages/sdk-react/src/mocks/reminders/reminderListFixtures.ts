import { entityIds } from '@/mocks/entities';
import { faker } from '@faker-js/faker';
import { paths } from '@monite/sdk-api/src/api';

export const createPaymentReminderListItemFixture = (
  reminder?: paths['/payment_reminders']['post']['requestBody']['content']['application/json']
): paths['/payment_reminders']['get']['responses']['200']['content']['application/json']['data'][number] => ({
  id: faker.string.uuid(),
  name: `Send payment reminders ${faker.number.int({
    min: 1,
    max: 30,
  })} days before due date`,
  created_at: faker.date.past().toString(),
  updated_at: faker.date.past().toString(),
  entity_id: entityIds[0],
  status: faker.datatype.boolean() ? 'active' : 'deleted',
  term_1_reminder: {
    days_before: faker.number.int({ min: 1, max: 4 }),
    body: faker.lorem.paragraph(),
    subject: faker.lorem.sentence(),
  },
  term_2_reminder: {
    days_before: faker.number.int({ min: 1, max: 4 }),
    body: faker.lorem.paragraph(),
    subject: faker.lorem.sentence(),
  },
  term_final_reminder: {
    days_before: faker.number.int({ min: 1, max: 4 }),
    body: faker.lorem.paragraph(),
    subject: faker.lorem.sentence(),
  },
  ...reminder,
});

export const paymentReminderListFixture: paths['/payment_reminders']['get']['responses']['200']['content']['application/json']['data'] =
  new Array(faker.number.int({ min: 4, max: 6 }))
    .fill('_')
    .map(createPaymentReminderListItemFixture);

export const createOverdueReminderListItemFixture = (
  reminder?: paths['/overdue_reminders']['post']['requestBody']['content']['application/json']
): paths['/overdue_reminders']['get']['responses']['200']['content']['application/json']['data'][number] => ({
  id: faker.string.uuid(),
  name: `Send payment reminders ${faker.number.int({
    min: 1,
    max: 30,
  })} after due date`,
  created_at: faker.date.past().toString(),
  updated_at: faker.date.past().toString(),
  terms: new Array(faker.number.int({ min: 2, max: 5 })).fill('_').map(() => ({
    days_after: faker.number.int({ min: 1, max: 5 }),
    subject: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
  })),
  ...reminder,
});

export const overdueReminderListFixture: paths['/overdue_reminders']['get']['responses']['200']['content']['application/json']['data'] =
  new Array(faker.number.int({ min: 4, max: 6 }))
    .fill('_')
    .map(createOverdueReminderListItemFixture);
