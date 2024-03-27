import { getRandomProperty } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import {
  AllowedCountries,
  VatRateCreator,
  VatRateListResponse,
  VatRateResponse,
  VatRateStatusEnum,
} from '@monite/sdk-api';

function getRandomVatRate(index: number): VatRateResponse {
  return {
    id: faker.string.nanoid(),
    value: index === 1 ? 0 : faker.number.int({ min: 0, max: 10_000 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.past().toISOString(),
    country: getRandomProperty(AllowedCountries),
    status: VatRateStatusEnum.ACTIVE,
    created_by: getRandomProperty(VatRateCreator),
  };
}

export const vatRatesFixture: VatRateListResponse = {
  data: new Array(10).fill('_').map((_, index) => getRandomVatRate(index)),
};
