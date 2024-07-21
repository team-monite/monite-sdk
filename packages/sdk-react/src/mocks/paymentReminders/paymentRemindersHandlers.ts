import type { components } from '@/api';
import { createPaymentReminder } from '@/mocks/paymentReminders/paymentRemindersFixtures';

import { http, HttpResponse, delay } from 'msw';

export const paymentRemindersHandlers = [
  http.post<
    {},
    components['schemas']['PaymentReminder'],
    components['schemas']['PaymentReminderResponse']
  >('*/payment_reminders', async ({ request }) => {
    const jsonBody = await request.json();

    await delay();

    return HttpResponse.json(createPaymentReminder(jsonBody));
  }),
];
