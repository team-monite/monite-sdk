import { components } from '@/api';
import { CounterpartResponse } from '@/core/queries';
import { AllowedCountries } from '@/enums/AllowedCountries';
import { counterpartListFixture } from '@/mocks';
import {
  getRandomItemFromArray,
  getRandomNumber,
} from '@/utils/test-utils-random';
import { faker } from '@faker-js/faker';

const genCounterpartContactFixture = (
  id: number = 0,
  counterpart: CounterpartResponse
): components['schemas']['CounterpartContactResponse'] => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: `contact-id-${id}`,
    counterpart_id: counterpart.id,
    title: 'Ms.',
    first_name: firstName,
    last_name: lastName,
    email: faker.internet.email({
      firstName,
      lastName,
    }),
    phone: faker.phone.number('+ ### ### ## ##'),
    is_default: id === 0,
    address: {
      country: getRandomItemFromArray(AllowedCountries),
      city: faker.location.city(),
      postal_code: faker.location.zipCode(),
      state: faker.location.state(),
      line1: faker.location.street(),
      line2: faker.location.streetAddress(),
    },
  };
};

/**
 * Fixture for counterpart contacts grouped by counterpart id
 * The key is `counterpartId` and the value is `Array<CounterpartContactResponse>`
 */
export const counterpartsContactsFixtures = (counterpartListFixture || []).reduce<
  Record<string, Array<components['schemas']['CounterpartContactResponse']>>
>((acc, counterpart) => {
  if (counterpart.type === 'individual') return acc;

  acc[counterpart.id] = new Array(getRandomNumber(2, 4))
    .fill('_')
    .map((_, id) => genCounterpartContactFixture(id, counterpart));

  return acc;
}, {});
