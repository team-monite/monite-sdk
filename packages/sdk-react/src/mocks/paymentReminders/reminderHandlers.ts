import type { components } from '@/api';

import { http, HttpResponse, delay } from 'msw';

import { getPaymentReminder, getOverdueReminder } from './reminderFixtures';

export const remindersHandlers = [
  http.get<
    {},
    components['schemas']['PaymentReminder'],
    components['schemas']['PaymentReminderResponse']
  >('*/payment_reminders', async ({ request }) => {
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
  >('*/overdue_reminders', async ({ request }) => {
    const jsonBody = await request.json();
    console.log('Received overdue_reminders request:', jsonBody);

    await delay();

    const response = getOverdueReminder(jsonBody);
    console.log('Returning overdue_reminders response:', response);
    return HttpResponse.json(response);
  }),
];
