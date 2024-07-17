import { components } from '@/api';
import { getRandomNumber } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';

export function generatePaymentTerm(index?: number): PaymentTermsResponse {
  const days = faker.number.int({ min: 2, max: 100 });
  const discount = faker.number.int({ min: 1, max: 100 });

  return {
    id: faker.string.uuid(),
    name: `${days} days ${index === 0 ? 'First Option' : ''}`.trim(),
    description: faker.datatype.boolean()
      ? `${discount}% discount before day ${faker.number.int({
          min: 1,
          max: 20,
        })}`
      : undefined,
    term_final: {
      number_of_days: days,
    },
  };
}

export const paymentTermsFixtures: PaymentTermsListResponse = {
  data: new Array(getRandomNumber(4, 20))
    .fill('_')
    .map((_, index) => generatePaymentTerm(index)),
};

type PaymentTermsListResponse =
  components['schemas']['PaymentTermsListResponse'];
type PaymentTermsResponse = components['schemas']['PaymentTermsResponse'];
