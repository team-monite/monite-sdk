import { paths } from '@/api';
import {
  overdueReminderListFixture,
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
];
