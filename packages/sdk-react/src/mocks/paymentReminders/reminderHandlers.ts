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

    await delay();

    return HttpResponse.json(getPaymentReminder(jsonBody));
  }),

  http.get<
    {},
    components['schemas']['OverdueReminderRequest'],
    components['schemas']['PaymentReminderResponse']
  >('*/overdue_reminders', async ({ request }) => {
    const jsonBody = await request.json();

    await delay();

    return HttpResponse.json(getOverdueReminder(jsonBody));
  }),
];
