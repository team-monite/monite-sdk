import type { components } from '@/api';
import {
  createOverdueReminder,
  overdueReminderListFixture,
} from '@/mocks/overdueReminders/overdueRemindersFixtures';
import { paymentReminderListFixture } from '@/mocks/paymentReminders';

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

  http.patch<
    { overdueReminderId: string },
    components['schemas']['OverdueReminderUpdateRequest'],
    components['schemas']['OverdueReminderResponse']
  >('*/overdue_reminders/:overdueReminderId', async ({ request, params }) => {
    const jsonBody = await request.json();

    let updatedOverdueReminder = overdueReminderListFixture.find(
      (overdueReminder) => overdueReminder.id === params.overdueReminderId
    );

    if (updatedOverdueReminder) {
      updatedOverdueReminder = {
        ...updatedOverdueReminder,
        ...jsonBody,
      };
    }

    await delay();

    return HttpResponse.json(updatedOverdueReminder);
  }),
];
