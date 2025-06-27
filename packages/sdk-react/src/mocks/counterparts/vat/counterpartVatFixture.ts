import { components } from '@/api';
import { VatIDTypeEnum } from '@/enums/VatIDTypeEnum';
import {
  getRandomItemFromArray,
  getRandomNumber,
} from '@/utils/test-utils-random';
import { faker } from '@faker-js/faker';

import { organizationId } from '../counterpart.mocks.types';
import { counterpartListFixture } from '../counterpart/counterpartFixture';

const genCounterpartVatFixture = (id: number = 0): CounterpartVatIDResponse => {
  return {
    id: `vat-id-${id}`,
    counterpart_id: organizationId,
    type: getRandomItemFromArray(VatIDTypeEnum) as components['schemas']['VatIDTypeEnum'],
    value: faker.string.numeric(10),
    country: getRandomItemFromArray(['DE', 'US', 'KZ', 'GE']),
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

type CounterpartVatIDResponse =
  components['schemas']['CounterpartVatIDResponse'];
