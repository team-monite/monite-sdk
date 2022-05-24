import { faker } from '@faker-js/faker';

import { getRandomItemFromArray } from '@/lib/monite-api/demo-data-generator/general.service';
import { AccessToken } from '@/lib/monite-api/fetch-token';
import {
  createMoniteClient,
  getMoniteApiVersion,
} from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';

export const createBankAccount = async ({
  token,
  is_default_for_currency,
  entity_id,
}: {
  token: AccessToken;
  is_default_for_currency: true;
  entity_id: string;
}) => {
  const { POST } = createMoniteClient({
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`,
    },
  });

  const display_name = faker.company.name();

  const { data, error, response } = await POST('/bank_accounts', {
    params: {
      header: {
        'x-monite-entity-id': entity_id,
        'x-monite-version': getMoniteApiVersion(),
      },
    },
    body: {
      is_default_for_currency,
      iban: faker.finance.iban(),
      bic: faker.finance.bic(),
      bank_name: `${display_name} Bank`,
      display_name,
      account_number: faker.finance.accountNumber(),
      account_holder_name: faker.finance.accountName(),
      routing_number: faker.finance.routingNumber(),
      currency: getRandomItemFromArray(['EUR', 'USD', 'GEL'] satisfies Array<
        components['schemas']['CurrencyEnum']
      >),
      country: getRandomItemFromArray(['GE', 'US', 'GB'] satisfies Array<
        components['schemas']['AllowedCountries']
      >),
    },
  });

  if (error) {
    console.error(
      `Failed to create Bank Account for the entity_id: "${entity_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(`Bank account create failed: ${JSON.stringify(error)}`);
  }

  return data;
};

export const getBankAccounts = async ({
  token,
  entity_id,
}: {
  token: AccessToken;
  entity_id: string;
}) => {
  const { GET } = createMoniteClient({
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`,
    },
  });

  const { data, error, response } = await GET('/bank_accounts', {
    params: {
      header: {
        'x-monite-entity-id': entity_id,
        'x-monite-version': getMoniteApiVersion(),
      },
    },
  });

  if (error) {
    console.error(
      `Failed to get Bank Account for the entity_id: "${entity_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(`Bank account fetch failed: ${JSON.stringify(error)}`);
  }

  return data.data;
};
