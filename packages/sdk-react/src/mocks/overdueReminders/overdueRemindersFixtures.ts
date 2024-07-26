import { components } from '@/api';
import { entityIds } from '@/mocks/entities';
import { faker } from '@faker-js/faker';

export const createOverdueReminder = (
  overdueReminder: components['schemas']['OverdueReminderRequest']
): components['schemas']['OverdueReminderResponse'] => ({
  ...overdueReminder,
  id: faker.string.nanoid(),
  created_at: faker.date.past().toString(),
  updated_at: faker.date.past().toString(),
});

export const overdueReminderListFixture: Array<
  components['schemas']['OverdueReminderResponse']
> = new Array(10).fill('_').map(() => {
  const overdueReminder: components['schemas']['OverdueReminderResponse'] = {
    id: faker.string.nanoid(),
    name: faker.lorem.word(),
    terms: [
      {
        days_after: faker.number.int({ min: 1, max: 10 }),
        subject: faker.lorem.sentence(),
        body: faker.lorem.sentence(),
      },
      {
        days_after: faker.number.int({ min: 1, max: 10 }),
        subject: faker.lorem.sentence(),
        body: faker.lorem.sentence(),
      },
      {
        days_after: faker.number.int({ min: 1, max: 10 }),
        subject: faker.lorem.sentence(),
        body: faker.lorem.sentence(),
      },
    ],
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
  };

  return overdueReminder;
});
