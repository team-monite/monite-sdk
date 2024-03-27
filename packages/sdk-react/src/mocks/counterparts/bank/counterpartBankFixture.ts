import { getRandomNumber, getRandomProperty } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import {
  AllowedCountries,
  CounterpartBankAccountResponse,
  CurrencyEnum,
} from '@monite/sdk-api';

import { individualId } from '../counterpart.mocks.types';

export const genCounterpartBankFixture = (
  id: string = 'id-0'
): CounterpartBankAccountResponse => {
  const country = getRandomProperty({
    DE: AllowedCountries.DE,
    US: AllowedCountries.US,
    GB: AllowedCountries.GB,
  });

  const currency = (() => {
    switch (country) {
      case AllowedCountries.DE:
        return CurrencyEnum.EUR;
      case AllowedCountries.US:
        return CurrencyEnum.USD;
      case AllowedCountries.GB:
        return CurrencyEnum.GBP;
      default:
        return CurrencyEnum.EUR;
    }
  })();

  if (id === 'id-0') {
    return {
      id: id,
      account_holder_name: 'account_holder_name',
      account_number: 'account_number',
      country: AllowedCountries.DE,
      currency: CurrencyEnum.EUR,
      is_default: false,
      routing_number: 'routing_number',
      sort_code: 'sort_code',
      counterpart_id: individualId,
      iban: 'iban',
      name: 'name',
      bic: 'bic',
    };
  }

  return {
    id: id,
    account_holder_name: `account_holder_name ${id}`,
    account_number: faker.finance.accountNumber(),
    country: country,
    currency: currency,
    is_default: false,
    routing_number: faker.finance.routingNumber(),
    sort_code: faker.finance.routingNumber().slice(0, 6),
    counterpart_id: individualId,
    iban: faker.finance.iban(),
    name: faker.finance.accountName(),
    bic: faker.finance.bic(),
  };
};

export const counterpartBankFixture: CounterpartBankAccountResponse =
  genCounterpartBankFixture();

export const counterpartBankListFixture: CounterpartBankAccountResponse[] =
  new Array(getRandomNumber(1, 4))
    .fill('test')
    .map((_, id) => genCounterpartBankFixture(`id-${id}`));
