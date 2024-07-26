import { components } from '@/api';
import { faker } from '@faker-js/faker';

export const createOverdueReminder = (
  overdueReminder: components['schemas']['OverdueReminderRequest']
): components['schemas']['OverdueReminderResponse'] => ({
  ...overdueReminder,
  id: faker.string.nanoid(),
  created_at: faker.date.past().toString(),
  updated_at: faker.date.past().toString(),
});
