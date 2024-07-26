import type { components } from '@/api';
import {
  createPaymentReminder,
  paymentReminderListFixture,
} from '@/mocks/paymentReminders/paymentRemindersFixtures';

import { http, HttpResponse, delay } from 'msw';

export const paymentRemindersHandlers = [
  http.get<
    { paymentReminderId: string },
    undefined,
    | components['schemas']['PaymentReminderResponse']
    | components['schemas']['ErrorSchemaResponse']
  >('*/payment_reminders/:paymentReminderId', async ({ request, params }) => {
    await delay();

    return HttpResponse.json(
      createPaymentReminder(paymentReminderListFixture[0])
    );
  }),

  http.post<
    {},
    components['schemas']['PaymentReminder'],
    components['schemas']['PaymentReminderResponse']
  >('*/payment_reminders', async ({ request }) => {
    const jsonBody = await request.json();

    await delay();

    return HttpResponse.json(createPaymentReminder(jsonBody));
  }),

  http.patch<
    { paymentReminderId: string },
    components['schemas']['PaymentReminderUpdateRequest'],
    components['schemas']['PaymentReminderResponse']
  >('*/payment_reminders/:paymentReminderId', async ({ request, params }) => {
    const jsonBody = await request.json();

    let updatedPaymentReminder = paymentReminderListFixture.find(
      (paymentReminder) => paymentReminder.id === params.paymentReminderId
    );

    if (updatedPaymentReminder) {
      updatedPaymentReminder = {
        ...updatedPaymentReminder,
        ...jsonBody,
      };
    }

    await delay();

    return HttpResponse.json(updatedPaymentReminder);
  }),
];
