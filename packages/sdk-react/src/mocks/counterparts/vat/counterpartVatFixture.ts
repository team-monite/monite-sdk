import { getRandomNumber, getRandomProperty } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import {
  AllowedCountries,
  CounterpartVatIDResponse,
  TaxIDTypeEnum,
} from '@monite/sdk-api';

import { organizationId } from '../counterpart.mocks.types';
import { counterpartListFixture } from '../counterpart/counterpartFixture';

const genCounterpartVatFixture = (id: number = 0): CounterpartVatIDResponse => {
  return {
    id: `vat-id-${id}`,
    counterpart_id: organizationId,
    type: getRandomProperty(TaxIDTypeEnum),
    value: faker.string.numeric(10),
    country: getRandomProperty({
      DE: AllowedCountries.DE,
      US: AllowedCountries.US,
      KZ: AllowedCountries.KZ,
      GE: AllowedCountries.GE,
    }),
  };
};

export const counterpartVatFixture: CounterpartVatIDResponse =
  genCounterpartVatFixture();

export const counterpartVatsByCounterpartIdFixture: Record<
  string,
  Array<CounterpartVatIDResponse>
> = counterpartListFixture.reduce<
  Record<string, Array<CounterpartVatIDResponse>>
>((acc, counterpart) => {
  acc[counterpart.id] = new Array(getRandomNumber(1, 5))
    .fill('_')
    .map((_, index) => genCounterpartVatFixture(index));

  return acc;
}, {});
