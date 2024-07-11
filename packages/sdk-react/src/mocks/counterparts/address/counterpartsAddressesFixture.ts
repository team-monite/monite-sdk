import { components } from '@/api';
import { counterpartListFixture } from '@/mocks';
import { getRandomNumber, getRandomProperty } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import { AllowedCountries } from '@monite/sdk-api';

import { organizationId } from '../counterpart.mocks.types';

function generateRandomAddress(
  counterpartId: string
): components['schemas']['CounterpartAddressResourceList'] {
  return {
    // @ts-expect-error - check how to get property for country without enums
    data: new Array(getRandomNumber(1, 5)).fill(1).map((_, index) => ({
      country: getRandomProperty(AllowedCountries),
      city: faker.location.city(),
      postal_code: faker.location.zipCode(),
      state: faker.location.state(),
      line1: faker.location.street(),
      line2: faker.location.streetAddress(),
      is_default: index === 0,
      counterpart_id: counterpartId,
      id: faker.string.uuid(),
    })),
  };
}

export function generateCounterpartAddress(): components['schemas']['CounterpartAddress'] {
  return {
    // @ts-expect-error - check how to get property for country without enums
    country: getRandomProperty(AllowedCountries),
    city: faker.location.city(),
    postal_code: faker.location.zipCode(),
    state: faker.datatype.boolean() ? faker.location.state() : undefined,
    line1: faker.location.street(),
    line2: faker.datatype.boolean()
      ? faker.location.streetAddress()
      : undefined,
  };
}

export const counterpartsAddressesFixture = counterpartListFixture
  .map((counterpart) => {
    return generateRandomAddress(counterpart.id);
  })
  .concat({
    data: [
      {
        country: AllowedCountries.GE,
        city: faker.location.city(),
        postal_code: faker.location.zipCode(),
        state: faker.location.state(),
        line1: faker.location.street(),
        line2: faker.location.streetAddress(),
        id: 'aa5a332e-7af1-401f-a741-df2c494f6e47',
        is_default: true,
        counterpart_id: organizationId,
      },
    ],
  });
