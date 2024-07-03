import { components } from '@/api';
import { counterpartListFixture } from '@/mocks';
import { getRandomNumber, getRandomProperty } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import {
  CounterpartAddressResourceList,
  AllowedCountries,
  CounterpartAddress,
} from '@monite/sdk-api';

import { organizationId } from '../counterpart.mocks.types';

function generateRandomAddress(
  counterpartId: string
): CounterpartAddressResourceList {
  return {
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

export function generateCounterpartAddress() {
  // TODO replace this with after migration
  return legacyGenerateCounterpartAddress() as components['schemas']['CounterpartAddress'];
}

export function legacyGenerateCounterpartAddress(): CounterpartAddress {
  return {
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
