import { components, paths } from '@/api';

import { http, HttpResponse, delay } from 'msw';

import { getPaymentReminder, getOverdueReminder } from './reminderFixtures';

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
    components['schemas']['PaymentReminder'],
    components['schemas']['PaymentReminderResponse']
  >(paymentReminderPath, async () => {
    await delay();

    return HttpResponse.json(getPaymentReminder);
  }),

  http.get<
    {},
    components['schemas']['OverdueReminderRequest'],
    components['schemas']['OverdueReminderResponse']
  >(overdueReminderPath, async () => {
    await delay();

    return HttpResponse.json(getOverdueReminder);
  }),
];
