import { paths } from '@/api';
import {
  overdueIDReminderListFixture,
  overdueReminderListFixture,
  paymentIDReminderListFixture,
  paymentReminderListFixture,
} from '@/mocks/paymentReminders/reminderFixtures';

import { delay, http, HttpResponse } from 'msw';

const paymentReminderPath: `*${Extract<
  keyof paths,
  '/payment_reminders'
>}` = `*/payment_reminders`;

const overdueReminderPath: `*${Extract<
  keyof paths,
  '/overdue_reminders'
>}` = `*/overdue_reminders`;

export const remindersHandlers = [
  http.get<
    {},
    undefined,
    paths['/payment_reminders']['get']['responses']['200']['content']['application/json']
  >(paymentReminderPath, async () => {
    await delay();

    return HttpResponse.json({ data: paymentReminderListFixture });
  }),

  http.get<
    {},
    undefined,
    paths['/overdue_reminders']['get']['responses']['200']['content']['application/json']
  >(overdueReminderPath, async () => {
    await delay();

    return HttpResponse.json({ data: overdueReminderListFixture });
  }),

  http.get<
    { overdue_reminder_id: string },
    undefined,
    paths['/overdue_reminders/{overdue_reminder_id}']['get']['responses']['200']['content']['application/json']
  >('*/overdue_reminders/:overdue_reminder_id', async ({ params }) => {
    const overdueReminder = overdueReminderListFixture.find(
      (overdueReminder) => overdueReminder.id === params.overdue_reminder_id
    );

    if (!overdueReminder) {
      await delay();

      return HttpResponse.json(undefined, {
        status: 404,
      });
    }

    await delay();

    return HttpResponse.json(overdueIDReminderListFixture[0]);
  }),

  http.get<
    { payment_reminder_id: string },
    undefined,
    paths['/payment_reminders/{payment_reminder_id}']['get']['responses']['200']['content']['application/json']
  >('*/payment_reminders/:payment_reminder_id', async ({ params }) => {
    const paymentReminder = paymentReminderListFixture.find(
      (paymentReminder) => paymentReminder.id === params.payment_reminder_id
    );

    if (!paymentReminder) {
      await delay();

      return HttpResponse.json(undefined, {
        status: 404,
      });
    }

    await delay();

    return HttpResponse.json(paymentIDReminderListFixture[0]);
  }),
];
