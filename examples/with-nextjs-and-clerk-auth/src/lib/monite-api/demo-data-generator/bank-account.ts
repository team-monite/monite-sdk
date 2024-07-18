import { faker } from '@faker-js/faker';

import {
  bankCountriesToCurrencies,
  chooseRandomCountryForDataGeneration,
} from '@/lib/monite-api/demo-data-generator/seed-values';
import { AccessToken } from '@/lib/monite-api/fetch-token';
import {
  createMoniteClient,
  getEntity,
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
  const moniteClient = createMoniteClient(token);

  const entity = await getEntity(moniteClient, entity_id);

  const entityCountry = entity.address.country;
  const country: keyof typeof bankCountriesToCurrencies =
    entityCountry in bankCountriesToCurrencies
      ? (entityCountry as keyof typeof bankCountriesToCurrencies)
      : chooseRandomCountryForDataGeneration();

  const bankName = faker.company.name();
  const currency = bankCountriesToCurrencies[country];
  const accountCreationParams: components['schemas']['CreateEntityBankAccountRequest'] =
    {
      is_default_for_currency,
      bank_name: `${bankName} Bank`,
      display_name: faker.finance.accountName(),
      currency: currency,
      country,
    };
  switch (currency) {
    case 'EUR':
      accountCreationParams.iban = faker.finance.iban(false, country);
      break;
    case 'GBP':
      accountCreationParams.account_holder_name =
        entity.organization.legal_name;
      accountCreationParams.account_number = faker.finance.accountNumber(8);
      accountCreationParams.sort_code = faker.finance.accountNumber(6);
      break;
    // USD accounts will need account_holder_name, account_number and routing_number
    default:
      throw new Error(
        `Bank account generator - unsupported currency: ${currency}`
      );
  }
  const { data, error, response } = await moniteClient.POST('/bank_accounts', {
    params: {
      header: {
        'x-monite-entity-id': entity_id,
        'x-monite-version': getMoniteApiVersion(),
      },
    },
    body: accountCreationParams,
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
