import { components } from '@/api';
import { getRandomNumber, getRandomProperty } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';

import { individualId } from '../counterpart.mocks.types';

export const genCounterpartBankFixture = (
  id: string = 'id-0'
): components['schemas']['CounterpartBankAccountResponse'] => {
  const country: components['schemas']['AllowedCountries'] = getRandomProperty({
    DE: 'DE',
    US: 'US',
    GB: 'GB',
  });

  const currency = (() => {
    switch (country) {
      case 'DE':
        return 'EUR';
      case 'US':
        return 'USD';
      case 'GB':
        return 'GBP';
      default:
        return 'EUR';
    }
  })();

  if (id === 'id-0') {
    return {
      id: id,
      account_holder_name: 'account_holder_name',
      account_number: 'account_number',
      country: 'DE',
      currency: 'EUR',
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

export const counterpartBankFixture: components['schemas']['CounterpartBankAccountResponse'] =
  genCounterpartBankFixture();

export const counterpartBankListFixture: components['schemas']['CounterpartBankAccountResponse'][] =
  new Array(getRandomNumber(1, 4))
    .fill('test')
    .map((_, id) => genCounterpartBankFixture(`id-${id}`));
