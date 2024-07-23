import { paths } from '@/api';
import { entityIds } from '@/mocks/entities';
import { faker } from '@faker-js/faker';

const sendPaymentNameGenerator = (days: number) =>
  `Send payment reminders ${days} days before due date`;

export const paymentReminderListFixture: paths['/payment_reminders']['get']['responses']['200']['content']['application/json']['data'] =
  new Array(15).fill('_').map(() => ({
    id: faker.string.nanoid(),
    name: sendPaymentNameGenerator(faker.datatype.number({ min: 1, max: 30 })),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    entity_id: entityIds[0],
    status: faker.datatype.boolean() ? 'active' : 'deleted',
  }));

export const overdueReminderListFixture: paths['/overdue_reminders']['get']['responses']['200']['content']['application/json']['data'] =
  new Array(15).fill('_').map(() => ({
    id: faker.string.nanoid(),
    name: sendPaymentNameGenerator(faker.datatype.number({ min: 1, max: 30 })),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
  }));

export type OverdueReminder =
  paths['/overdue_reminders/{overdue_reminder_id}']['get']['responses']['200']['content']['application/json'];

export const overdueIDReminderListFixture: OverdueReminder[] = new Array(15)
  .fill(null)
  .map<OverdueReminder>(() => {
    const recipients: OverdueReminder['recipients'] =
      Math.random() > 0.5
        ? {
            bcc: Math.random() > 0.5 ? [faker.internet.email()] : undefined,
            cc: Math.random() > 0.5 ? [faker.internet.email()] : undefined,
            to: Math.random() > 0.5 ? [faker.internet.email()] : undefined,
          }
        : undefined;

    const terms: OverdueReminder['terms'] =
      Math.random() > 0.5
        ? [
            {
              body: faker.lorem.paragraph(),
              days_after: faker.datatype.number({ min: 1, max: 30 }),
              subject: faker.lorem.sentence(),
            },
          ]
        : undefined;

    return {
      id: faker.string.uuid(),
      name: sendPaymentNameGenerator(
        faker.datatype.number({ min: 1, max: 30 })
      ),
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
      ...(recipients && { recipients }),
      ...(terms && { terms }),
    };
  });

export type PaymentReminderResponse =
  paths['/payment_reminders/{payment_reminder_id}']['get']['responses']['200']['content']['application/json'];

export const paymentIDReminderListFixture: PaymentReminderResponse[] =
  new Array(15).fill(null).map<PaymentReminderResponse>(() => {
    const recipients = {
      bcc: Math.random() > 0.5 ? [faker.internet.email()] : undefined,
      cc: Math.random() > 0.5 ? [faker.internet.email()] : undefined,
      to: Math.random() > 0.5 ? [faker.internet.email()] : undefined,
    };

    const termReminder = {
      body: faker.lorem.paragraph(),
      days_after: faker.datatype.number({ min: 1, max: 30 }),
      subject: faker.lorem.sentence(),
    };

    return {
      id: faker.string.uuid(),
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
      entity_id: faker.string.uuid(),
      name: sendPaymentNameGenerator(
        faker.datatype.number({ min: 1, max: 30 })
      ),
      recipients,
      term_1_reminder: Math.random() > 0.5 ? termReminder : undefined,
      term_2_reminder: Math.random() > 0.5 ? termReminder : undefined,
      term_final_reminder: Math.random() > 0.5 ? termReminder : undefined,
    } as PaymentReminderResponse;
  });
