import type { components } from '@/api';
import {
  createOverdueReminder,
  overdueReminderListFixture,
} from '@/mocks/overdueReminders/overdueRemindersFixtures';

import { http, HttpResponse, delay } from 'msw';

export const overdueRemindersHandlers = [
  http.get<
    { overdueReminderId: string },
    undefined,
    | components['schemas']['OverdueReminderResponse']
    | components['schemas']['ErrorSchemaResponse']
  >('*/overdue_reminders/:overdueReminderId', async () => {
    await delay();

    return HttpResponse.json(
      createOverdueReminder(overdueReminderListFixture[0])
    );
  }),

  http.post<
    {},
    components['schemas']['OverdueReminderRequest'],
    components['schemas']['OverdueReminderResponse']
  >('*/overdue_reminders', async ({ request }) => {
    const jsonBody = await request.json();

    await delay();

    return HttpResponse.json(createOverdueReminder(jsonBody));
  }),
];
