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
  >(paymentReminderPath, async ({ request }) => {
    const jsonBody = await request.json();
    console.log('Received payment_reminders request:', jsonBody);

    await delay();

    const response = getPaymentReminder(jsonBody);
    console.log('Returning payment_reminders response:', response);
    return HttpResponse.json(response);
  }),

  http.get<
    {},
    components['schemas']['OverdueReminderRequest'],
    components['schemas']['PaymentReminderResponse']
  >(overdueReminderPath, async ({ request }) => {
    const jsonBody = await request.json();
    console.log('Received overdue_reminders request:', jsonBody);

    await delay();

    const response = getOverdueReminder(jsonBody);
    console.log('Returning overdue_reminders response:', response);
    return HttpResponse.json(response);
  }),
];
