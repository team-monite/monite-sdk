import { getRandomNumber } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import {
  PaymentTermsListResponse,
  PaymentTermsResponse,
} from '@monite/sdk-api';

export function generatePaymentTerm(): PaymentTermsResponse {
  const days = faker.number.int({ min: 2, max: 100 });
  const discount = faker.number.int({ min: 1, max: 100 });

  return {
    id: faker.string.uuid(),
    name: `${days} days`,
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
  data: new Array(getRandomNumber(4, 20)).fill('_').map(generatePaymentTerm),
};
