import { paths } from '@/api';
import { entityIds } from '@/mocks/entities';
import { faker } from '@faker-js/faker';

const sendPaymentNameGenerator = (days: number, type: string) =>
  `Send ${type} reminders ${days} days before due date`;

export const paymentReminderListFixture: paths['/payment_reminders']['get']['responses']['200']['content']['application/json']['data'] =
  new Array(5).fill('_').map(() => ({
    id: faker.string.nanoid(),
    name: sendPaymentNameGenerator(
      faker.number.int({ min: 1, max: 30 }),
      'payment'
    ),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    entity_id: entityIds[0],
    status: faker.datatype.boolean() ? 'active' : 'deleted',
  }));

export const overdueReminderListFixture: paths['/overdue_reminders']['get']['responses']['200']['content']['application/json']['data'] =
  new Array(5).fill('_').map(() => ({
    id: faker.string.nanoid(),
    name: sendPaymentNameGenerator(
      faker.number.int({ min: 1, max: 30 }),
      'overdue'
    ),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
  }));

type OverdueReminder =
  paths['/overdue_reminders/{overdue_reminder_id}']['get']['responses']['200']['content']['application/json'];

// ToDo: remove randomization for undefined data
// we show    terms?: components["schemas"]["OverdueReminderTerm"][];  days_after: number;
export const overdueIDReminderListFixture: OverdueReminder[] = new Array(5)
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
              days_after: faker.number.int({ min: 1, max: 30 }),
              subject: faker.lorem.sentence(),
            },
          ]
        : undefined;

    return {
      id: faker.string.uuid(),
      name: sendPaymentNameGenerator(
        faker.datatype.number({ min: 1, max: 30 }),
        'payment'
      ),
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
      ...(recipients && { recipients }),
      ...(terms && { terms }),
    };
  });

type PaymentReminderResponse =
  paths['/payment_reminders/{payment_reminder_id}']['get']['responses']['200']['content']['application/json'];

// ToDo: height button the same height the input form

// ToDo: remove randomization for undefined data
// we show   term1, term2, term_final  recipients?: components["schemas"]["PaymentReminderRecipients"];
export const paymentIDReminderListFixture: PaymentReminderResponse[] =
  new Array(5)
    .fill(null)
    .map<PaymentReminderResponse>((): PaymentReminderResponse => {
      const recipients = {
        bcc: Math.random() > 0.5 ? [faker.internet.email()] : undefined,
        cc: Math.random() > 0.5 ? [faker.internet.email()] : undefined,
        to: Math.random() > 0.5 ? [faker.internet.email()] : undefined,
      };

      const termReminder = {
        body: faker.lorem.paragraph(),
        days_before: faker.datatype.number({ min: 1, max: 30 }),
        subject: faker.lorem.sentence(),
      };

      return {
        id: faker.string.uuid(),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
        entity_id: faker.string.uuid(),
        name: sendPaymentNameGenerator(
          faker.number.int({ min: 1, max: 30 }),
          'payment'
        ),
        recipients,
        term_1_reminder: Math.random() > 0.5 ? termReminder : undefined,
        term_2_reminder: Math.random() > 0.5 ? termReminder : undefined,
        term_final_reminder: Math.random() > 0.5 ? termReminder : undefined,
        status: faker.helpers.arrayElement(['active', 'deleted']),
      };
    });
