import type { components } from '@/api';
import { createOverdueReminder } from '@/mocks/overdueReminders/overdueRemindersFixtures';

import { http, HttpResponse, delay } from 'msw';

export const overdueRemindersHandlers = [
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
