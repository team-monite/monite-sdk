import { components } from '@/api';
import { CounterpartResponse } from '@/core/queries';
import { counterpartListFixture } from '@/mocks';
import { getRandomNumber, getRandomProperty } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import { AllowedCountries } from '@monite/sdk-api';

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
      // @ts-expect-error - getRandomProperty is not working because AllowedCountries is not an enum
      country: getRandomProperty(AllowedCountries),
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
export const counterpartsContactsFixtures = counterpartListFixture.reduce<
  Record<string, Array<components['schemas']['CounterpartContactResponse']>>
>((acc, counterpart) => {
  acc[counterpart.id] = new Array(getRandomNumber(2, 4))
    .fill('_')
    .map((_, id) => genCounterpartContactFixture(id, counterpart));

  return acc;
}, {});
