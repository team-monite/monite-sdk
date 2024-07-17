import { components } from '@/api';
import { AllowedCountries } from '@/enums/AllowedCountries';
import { getRandomItemFromArray } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';

function getRandomVatRate(index: number): VatRateResponse {
  return {
    id: faker.string.nanoid(),
    value: index === 1 ? 0 : faker.number.int({ min: 0, max: 10_000 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.past().toISOString(),
    country: getRandomItemFromArray(AllowedCountries),
    status: 'active',
    created_by: getRandomItemFromArray(['monite', 'accounting']),
  };
}

export const vatRatesFixture: VatRateListResponse = {
  data: new Array(10).fill('_').map((_, index) => getRandomVatRate(index)),
};

type AllowedCountries = components['schemas']['AllowedCountries'];
type VatRateCreator = components['schemas']['VatRateCreator'];
type VatRateListResponse = components['schemas']['VatRateListResponse'];
type VatRateResponse = components['schemas']['VatRateResponse'];
type VatRateStatusEnum = components['schemas']['VatRateStatusEnum'];
