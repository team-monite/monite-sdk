import { entityUsers } from '@/mocks/entityUsers/entityUserByIdFixture';
import {
  getRandomItemFromArray,
  getRandomNumber,
  getRandomProperty,
} from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import {
  AllowedCountries,
  CurrencyEnum,
  EntityBankAccountPaginationResponse,
  EntityBankAccountResponse,
} from '@monite/sdk-api';

export const bankAccountsFixture: EntityBankAccountPaginationResponse = {
  prev_pagination_token: undefined,
  next_pagination_token: undefined,
  data: new Array(getRandomNumber(0, 4)).fill('_').map((_, index) => {
    const bankAccount: EntityBankAccountResponse = {
      id: faker.string.nanoid(),
      iban: faker.finance.iban(),
      bic: faker.finance.bic(),
      bank_name: faker.datatype.boolean() ? faker.animal.cat() : undefined,
      is_default_for_currency: index === 0,
      display_name: faker.datatype.boolean()
        ? faker.finance.accountName()
        : undefined,
      was_created_by_user_id: getRandomProperty(entityUsers).id,
      account_holder_name: faker.finance.accountName(),
      account_number: faker.finance.accountNumber(),
      routing_number: faker.finance.routingNumber(),
      sort_code: faker.finance.routingNumber().slice(0, 6),
      currency: faker.datatype.boolean()
        ? getRandomItemFromArray([
            CurrencyEnum.EUR,
            CurrencyEnum.GBP,
            CurrencyEnum.USD,
          ])
        : undefined,
      country: faker.datatype.boolean()
        ? getRandomProperty(AllowedCountries)
        : undefined,
    };

    return bankAccount;
  }),
};
