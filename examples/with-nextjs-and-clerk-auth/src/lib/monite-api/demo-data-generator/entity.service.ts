import chalk from 'chalk';

import { faker } from '@faker-js/faker';

import {
  GeneralService,
  getRandomItemFromArray,
} from '@/lib/monite-api/demo-data-generator/general.service';
import { getMoniteApiVersion } from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';

const bankAccountsMockData: Array<
  components['schemas']['CreateEntityBankAccountRequest']
> = [
  {
    country: 'DE',
    currency: 'EUR',
    iban: 'DE89370400440532013000',
    account_holder_name: faker.finance.accountName(),
    display_name: 'Germany account 1',
  },
  {
    country: 'US',
    currency: 'USD',
    account_holder_name: faker.finance.accountName(),
    display_name: 'US account 1',
    account_number: faker.finance.accountNumber(),
    routing_number: faker.finance.routingNumber(),
  },
  {
    country: 'FR',
    currency: 'EUR',
    iban: 'FR1420041010050500013M02606',
    account_holder_name: faker.finance.accountName(),
    display_name: 'France account 1',
  },
  {
    country: 'NL',
    currency: 'EUR',
    iban: 'NL91ABNA0417164300',
    account_holder_name: faker.finance.accountName(),
    display_name: 'Netherlands account 1',
  },
];

interface IEntityServiceOptions {
  /**
   * Describes, how many vat ids should be created.
   * By default, 5
   */
  vatIds: {
    count: number;
  };
}

export class EntityService extends GeneralService {
  private options: IEntityServiceOptions = {
    vatIds: {
      count: 2,
    },
  };

  private async createBankAccount(
    body: components['schemas']['CreateEntityBankAccountRequest']
  ) {
    const { data, error, response } = await this.request.POST(
      '/bank_accounts',
      {
        params: {
          header: {
            'x-monite-entity-id': this.entityId,
            'x-monite-version': getMoniteApiVersion(),
          },
        },
        body,
      }
    );

    if (error) {
      console.error(
        `❌ Failed to create bank account for the entity_id: "${this.entityId}"`,
        `x-request-id: ${response.headers.get('x-request-id')}`
      );

      throw new Error(`Bank account creation error: ${JSON.stringify(error)}`);
    }

    return data;
  }

  public async createBankAccounts() {
    const bankAccounts: Array<
      components['schemas']['EntityBankAccountResponse']
    > = [];

    for (let i = 0; i < bankAccountsMockData.length; i++) {
      console.log(
        chalk.bgBlueBright(
          ` - Creating bank account (${i + 1}/${bankAccountsMockData.length})`
        )
      );

      await this.createBankAccount(bankAccountsMockData[i])
        .then((bankAccount) => {
          bankAccounts.push(bankAccount);
        })
        .catch(console.error);
    }

    if (bankAccounts.length) {
      console.log(chalk.black.bgGreenBright(`✅ Bank accounts created`));
      this.logger?.({ message: '✅ Bank accounts created' });
    } else {
      console.log(chalk.black.bgYellow(`❌ Bank accounts list is empty`));
    }

    return bankAccounts;
  }

  private async createVatId() {
    const country = getRandomItemFromArray(['DE'] satisfies Array<
      components['schemas']['AllowedCountries']
    >);

    const { data, error, response } = await this.request.POST(
      '/entities/{entity_id}/vat_ids',
      {
        params: {
          path: {
            entity_id: this.entityId,
          },
          header: {
            'x-monite-version': getMoniteApiVersion(),
          },
        },
        body: {
          country,
          type: 'unknown',
          value: faker.string.numeric(12),
        },
      }
    );

    if (error) {
      console.error(
        `❌ Failed to create "Entity Vat ID" for the entity_id: "${this.entityId}"`,
        `x-request-id: ${response.headers.get('x-request-id')}`
      );

      throw new Error(`Entity vat id create error: ${JSON.stringify(error)}`);
    }

    return data;
  }

  public async createVatIds(): Promise<
    Array<components['schemas']['EntityVatIDResponse']>
  > {
    this.logger?.({ message: 'Creating entity Vat IDs...' });

    const entityVatIds: Array<components['schemas']['EntityVatIDResponse']> =
      [];

    for (let i = 0; i < this.options.vatIds.count; i++) {
      const message = ` - Creating entity vat id (${i + 1}/${
        this.options.vatIds.count
      }`;

      console.log(chalk.bgBlueBright(message));
      this.logger?.({
        message,
      });

      await this.createVatId()
        .then((vatId) => entityVatIds.push(vatId))
        .catch(console.error);
    }

    if (entityVatIds.length) {
      console.log(chalk.black.bgGreenBright(`✅ Entity vat ids created`));
      this.logger?.({ message: '✅ Entity vat ids created' });
    } else {
      console.log(chalk.black.bgYellow(`❌ Entity vat ids list is empty`));
    }

    return entityVatIds;
  }
}
