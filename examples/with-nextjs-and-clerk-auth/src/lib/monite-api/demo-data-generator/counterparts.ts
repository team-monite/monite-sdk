import chalk from 'chalk';

import { faker } from '@faker-js/faker';

import {
  GeneralService,
  getRandomItemFromArray,
} from '@/lib/monite-api/demo-data-generator/general.service';
import {
  bankCountriesToCurrencies,
  demoBankAccountBICList,
  getRandomCountry,
} from '@/lib/monite-api/demo-data-generator/seed-values';
import {
  getMoniteApiVersion,
  MoniteClient,
} from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';

type CounterpartBankAccountResponse =
  components['schemas']['CounterpartBankAccountResponse'];
type CounterpartVatIDResponse =
  components['schemas']['CounterpartVatIDResponse'];
type VatIDTypeEnum = components['schemas']['VatIDTypeEnum'];
type AllowedCountries = components['schemas']['AllowedCountries'];

interface ICounterpartsBuilderOptions {
  counterparts: {
    /**
     * How many counterparts to create
     *
     * If not set, the default is 15
     */
    count: number;
  };

  bankAccounts: {
    /**
     * Create counterparts with bank accounts
     *
     * By default, it is true, and bank accounts will be created
     *  for the counterparts
     */
    enabled: boolean;
    count: number;
  };

  vats: {
    /**
     * Create counterparts with VAT IDs
     *
     * By default, it is true, and VAT IDs will be created
     *  for the counterparts
     */
    enabled: boolean;
    count: number;
  };
}

interface ICounterpartsServiceResponse {
  counterparts: Array<components['schemas']['CounterpartResponse']>;
}

export class CounterpartsService extends GeneralService {
  private options: ICounterpartsBuilderOptions = {
    counterparts: {
      count: 3,
    },
    bankAccounts: {
      enabled: true,
      count: 2,
    },
    vats: {
      enabled: true,
      count: 2,
    },
  };

  public withOptions(options: Partial<ICounterpartsBuilderOptions>): this {
    this.options = {
      ...this.options,
      ...options,
    };

    return this;
  }

  public async create(): Promise<ICounterpartsServiceResponse> {
    const counterparts: Array<components['schemas']['CounterpartResponse']> =
      [];
    for (
      let counterpartsIndex = 0;
      counterpartsIndex < this.options.counterparts.count;
      counterpartsIndex++
    ) {
      console.log(
        chalk.bgBlueBright(
          ` - Creating counterpart (${counterpartsIndex + 1}/${
            this.options.counterparts.count
          })`
        )
      );

      const counterpart = await createCounterpart({
        moniteClient: this.request,
        entity_id: this.entityId,
      });

      counterparts.push(counterpart);
    }
    console.log(chalk.black.bgGreenBright(`✅ Counterparts created 👤`));

    const counterpartBankAccounts: Array<CounterpartBankAccountResponse> = [];
    for (
      let counterpartIndex = 0;
      counterpartIndex < counterparts.length;
      counterpartIndex++
    ) {
      for (
        let bankAccountsIndex = 0;
        bankAccountsIndex < this.options.bankAccounts.count;
        bankAccountsIndex++
      ) {
        console.log(
          chalk.bgBlueBright(
            ` - Creating bank accounts for (${
              counterpartIndex + 1
            }) counterpart (${bankAccountsIndex + 1}/${
              this.options.bankAccounts.count
            })`
          )
        );

        const counterpart = counterparts[counterpartIndex];
        try {
          const counterpartBankAccount = await createCounterpartBankAccount({
            moniteClient: this.request,
            is_default_for_currency: true,
            counterpart_id: counterpart.id,
            entity_id: this.entityId,
          });
          counterpartBankAccounts.push(counterpartBankAccount);
        } catch (error) {
          console.error(
            chalk.redBright.bgBlack(
              '❌ Error when creating a counterpart bank account'
            ),
            error
          );
        }
      }
    }

    if (counterpartBankAccounts.length) {
      console.log(
        chalk.black.bgGreenBright(`✅ Counterparts bank accounts created 👤`)
      );
    } else {
      console.error(
        chalk.black.bgYellow(`❌ Counterparts bank accounts list is empty`)
      );
    }

    const entity = await this.getEntity();

    const counterpartVats: Array<
      components['schemas']['CounterpartVatIDResponse']
    > = [];
    for (
      let counterpartsIndex = 0;
      counterpartsIndex < counterparts.length;
      counterpartsIndex++
    ) {
      for (
        let vatsIndex = 0;
        vatsIndex < this.options.vats.count;
        vatsIndex++
      ) {
        console.log(
          chalk.bgBlueBright(
            ` - Creating VAT IDs for (${counterpartsIndex + 1}) counterpart (${
              vatsIndex + 1
            }/${this.options.vats.count})`
          )
        );

        const counterpart = counterparts[counterpartsIndex];
        try {
          const counterpartVat = await createCounterpartVatId({
            moniteClient: this.request,
            counterpart_id: counterpart.id,
            entity,
          });
          counterpartVats.push(counterpartVat);
        } catch (error) {
          console.error(
            chalk.redBright.bgBlack(
              '❌ Error when creating a counterpart vat id'
            ),
            error
          );
        }
      }
    }

    if (counterpartVats.length) {
      console.log(chalk.black.bgGreenBright(`✅ Counterparts vats created 👤`));
    } else {
      console.error(chalk.black.bgYellow(`❌ Counterparts vats list is empty`));
    }

    return {
      counterparts,
    };
  }
}

export const createCounterpart = async ({
  moniteClient,
  entity_id,
}: {
  moniteClient: MoniteClient;
  entity_id: string;
}): Promise<components['schemas']['CounterpartResponse']> => {
  const is_vendor = faker.datatype.boolean();
  const addressCountries = ['DE'] satisfies Array<AllowedCountries>;

  const { data, error, response } = await moniteClient.POST('/counterparts', {
    params: {
      header: {
        'x-monite-entity-id': entity_id,
        'x-monite-version': getMoniteApiVersion(),
      },
    },
    body: {
      language: 'en',
      reminders_enabled: faker.datatype.boolean(),
      type: 'organization',
      tax_id: faker.number.hex({ min: 100000000, max: 999999999 }),
      organization: {
        legal_name: faker.company.name(),
        is_vendor,
        // `is_vendor` or `is_customer` must be true
        is_customer: faker.datatype.boolean() || !is_vendor,
        email: faker.internet.email(),
        address: {
          country: getRandomItemFromArray(addressCountries),
          city: faker.location.city(),
          postal_code: faker.location.zipCode(),
          state: faker.location.state(),
          line1: faker.location.streetAddress(false),
          line2: faker.location.secondaryAddress(),
        },
      },
    },
  });

  if (error) {
    console.error(
      `Failed to create Counterpart for the entity_id: "${entity_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(`Counterpart create failed: ${JSON.stringify(error)}`);
  }

  return data;
};

export const createCounterpartVatId = async ({
  moniteClient,
  counterpart_id,
  entity,
}: {
  moniteClient: MoniteClient;
  counterpart_id: string;
  entity: components['schemas']['EntityOrganizationResponse'];
}): Promise<CounterpartVatIDResponse> => {
  const value = String(faker.number.int(10_000));
  const addressCountries = ['DE', 'US', 'GB'] satisfies Array<AllowedCountries>;
  const counterpartCountry = getRandomItemFromArray(addressCountries);
  const entityCountry = entity.address.country;
  let vatIdType: VatIDTypeEnum = 'unknown';
  switch (entityCountry) {
    case 'GB':
      vatIdType =
        counterpartCountry == 'GB'
          ? 'gb_vat'
          : counterpartCountry == 'DE'
          ? 'eu_vat'
          : 'unknown';
      break;
    case 'DE':
      vatIdType =
        counterpartCountry == 'GB' || counterpartCountry == 'DE'
          ? 'eu_vat'
          : 'unknown';
      break;
  }

  const { data, error, response } = await moniteClient.POST(
    '/counterparts/{counterpart_id}/vat_ids',
    {
      params: {
        path: {
          counterpart_id,
        },
        header: {
          'x-monite-version': getMoniteApiVersion(),
          'x-monite-entity-id': entity.id,
        },
      },
      body: {
        type: vatIdType,
        value,
        country: counterpartCountry,
      } as components['schemas']['CounterpartVatID'],
    }
  );

  if (error) {
    console.error(
      `Failed to create VAT ID for the counterpart_id: "${counterpart_id}" in the entity_id: "${entity.id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(`VAT ID create failed: ${JSON.stringify(error)}`);
  }

  return data;
};

export const createCounterpartBankAccount = async ({
  moniteClient,
  is_default_for_currency,
  counterpart_id,
  entity_id,
}: {
  moniteClient: MoniteClient;
  is_default_for_currency: true;
  counterpart_id: string;
  entity_id: string;
}): Promise<CounterpartBankAccountResponse> => {
  const countryCode = getRandomCountry();
  const currency = bankCountriesToCurrencies[countryCode];

  const { data, error, response } = await moniteClient.POST(
    '/counterparts/{counterpart_id}/bank_accounts',
    {
      params: {
        path: {
          counterpart_id,
        },
        header: {
          'x-monite-version': getMoniteApiVersion(),
          'x-monite-entity-id': entity_id,
        },
      },
      body: {
        is_default_for_currency,
        name: faker.finance.accountName(),
        account_number: faker.finance.accountNumber(),
        account_holder_name: faker.finance.accountName(),
        routing_number: faker.finance.routingNumber(),
        iban: faker.finance.iban(false, countryCode),
        bic: getRandomItemFromArray(demoBankAccountBICList[countryCode]),
        country: countryCode,
        currency,
      },
    }
  );

  if (error) {
    console.error(
      `Failed to create Bank Account for the entity_id: "${entity_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(`Bank account create failed: ${JSON.stringify(error)}`);
  }

  return data;
};
