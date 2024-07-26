import { paths } from '@/api';

import { delay, http, HttpResponse } from 'msw';

import {
  createOverdueReminderListItemFixture,
  createPaymentReminderListItemFixture,
  overdueReminderListFixture,
  paymentReminderListFixture,
} from './reminderListFixtures';

export const remindersHandlers = [
  http.post<
    {},
    paths['/payment_reminders']['post']['requestBody']['content']['application/json'],
    paths['/payment_reminders']['post']['responses']['201']['content']['application/json']
  >('*/payment_reminders', async ({ request }) => {
    const jsonBody = await request.json();

    const newPaymentReminder = createPaymentReminderListItemFixture(jsonBody);
    paymentReminderListFixture.push(newPaymentReminder);

    await delay();
    return HttpResponse.json(newPaymentReminder);
  }),

  http.post<
    {},
    paths['/overdue_reminders']['post']['requestBody']['content']['application/json'],
    paths['/overdue_reminders']['post']['responses']['201']['content']['application/json']
  >('*/overdue_reminders', async ({ request }) => {
    const jsonBody = await request.json();

    const newOverdueReminder = createOverdueReminderListItemFixture(jsonBody);
    overdueReminderListFixture.push(newOverdueReminder);

    await delay();
    return HttpResponse.json(newOverdueReminder);
  }),

  http.patch<
    { payment_reminder_id: string },
    | paths['/payment_reminders/{payment_reminder_id}']['patch']['requestBody']['content']['application/json'],
    | paths['/payment_reminders/{payment_reminder_id}']['patch']['responses']['200']['content']['application/json']
    | paths['/payment_reminders/{payment_reminder_id}']['patch']['responses']['404']['content']['application/json']
  >('*/payment_reminders/:payment_reminder_id', async ({ request, params }) => {
    const jsonBody = await request.json();

    const paymentReminderToUpdate = paymentReminderListFixture.find(
      (paymentReminder) => paymentReminder.id === params.payment_reminder_id
    );

    if (!paymentReminderToUpdate) {
      await delay();
      return HttpResponse.json(
        {
          error: {
            message: 'Payment Reminder not found',
          },
        },
        {
          status: 404,
        }
      );
    }

    Object.assign(paymentReminderToUpdate, jsonBody);

    await delay();

    return HttpResponse.json({
      ...paymentReminderToUpdate,
      ...jsonBody,
    });
  }),

  http.patch<
    { overdue_reminder_id: string },
    paths['/overdue_reminders/{overdue_reminder_id}']['patch']['requestBody']['content']['application/json'],
    | paths['/overdue_reminders/{overdue_reminder_id}']['patch']['responses']['200']['content']['application/json']
    | paths['/overdue_reminders/{overdue_reminder_id}']['patch']['responses']['404']['content']['application/json']
  >('*/overdue_reminders/:overdue_reminder_id', async ({ request, params }) => {
    const jsonBody = await request.json();

    const overdueReminderToUpdate = overdueReminderListFixture.find(
      (overdueReminder) => overdueReminder.id === params.overdue_reminder_id
    );

    if (!overdueReminderToUpdate) {
      await delay();
      return HttpResponse.json(
        {
          error: {
            message: 'Overdue Reminder not found',
          },
        },
        {
          status: 404,
        }
      );
    }

    Object.assign(overdueReminderToUpdate, jsonBody);

    return HttpResponse.json({
      ...overdueReminderToUpdate,
      ...jsonBody,
    });
  }),

  http.get<
    {},
    undefined,
    paths['/payment_reminders']['get']['responses']['200']['content']['application/json']
  >('*/payment_reminders', async () => {
    await delay();

    return HttpResponse.json({ data: paymentReminderListFixture });
  }),

  http.get<
    {},
    undefined,
    paths['/overdue_reminders']['get']['responses']['200']['content']['application/json']
  >('*/overdue_reminders', async () => {
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

    return HttpResponse.json(overdueReminder);
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

    return HttpResponse.json(paymentReminder);
  }),
];
