import { components } from '@/api';
import { receivableListFixture } from '@/mocks';
import { faker } from '@faker-js/faker';

export const recurrenceFixture = (
  payload?:
    | components['schemas']['CreateRecurrencePayload']
    | components['schemas']['UpdateRecurrencePayload']
): components['schemas']['RecurrenceResponse'] => {
  return {
    id: faker.string.uuid(),
    body_text: faker.lorem.paragraph(),
    subject_text: faker.lorem.sentence(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.past().toISOString(),
    automation_level: faker.helpers.arrayElement([
      'draft',
      'issue',
      'issue_and_send',
    ]),
    day_of_month: faker.helpers.arrayElement(['first_day', 'last_day']),
    frequency: faker.helpers.arrayElement([
      'day',
      'week',
      'month',
      'quarter',
      'year',
    ]),
    interval: faker.number.int({ min: 1, max: 12 }),
    start_date: faker.date.future().toISOString().split('T')[0],
    start_month: faker.number.int({ min: 1, max: 6 }),
    start_year: faker.number.int({ min: 2024, max: 2024 }),
    end_month: faker.number.int({ min: 6, max: 12 }),
    end_year: faker.number.int({ min: 2024, max: 2024 }),
    status: faker.helpers.arrayElement([
      'active',
      'paused',
      'canceled',
      'completed',
    ]),
    invoice_id:
      receivableListFixture.invoice[
        faker.number.int({
          min: 0,
          max: receivableListFixture.invoice.length - 1,
        })
      ].id,
    current_iteration: 1,
    iterations: new Array(faker.number.int({ min: 1, max: 10 }))
      .fill('')
      .map((_, index) => {
        const iterationStatus = faker.helpers.arrayElement([
          'pending',
          'completed',
          'canceled',
          'issue_failed',
          'send_failed',
        ] as const);

        return {
          iteration: index + 1,
          status: iterationStatus,
          issue_at: faker.date.past().toISOString(),
          issued_invoice_id:
            iterationStatus === 'completed'
              ? receivableListFixture.invoice[
                  faker.number.int({
                    min: 0,
                    max: receivableListFixture.invoice.length - 1,
                  })
                ].id
              : undefined,
        };
      }),
    ...payload,
  };
};

export const recurrenceListFixture: components['schemas']['RecurrenceResponseList'] =
  {
    data: new Array(faker.number.int({ min: 1, max: 10 }))
      .fill('')
      .map(recurrenceFixture),
  };
