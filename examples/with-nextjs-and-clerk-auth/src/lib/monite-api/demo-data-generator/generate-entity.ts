import { faker } from '@faker-js/faker';

import { CounterpartsService } from '@/lib/monite-api/demo-data-generator/counterparts';
import {
  getRandomItemFromArray,
  ILogger,
} from '@/lib/monite-api/demo-data-generator/general.service';
import { MeasureUnitsService } from '@/lib/monite-api/demo-data-generator/measure-units.service';
import { ProductsService } from '@/lib/monite-api/demo-data-generator/products.service';
import { ReceivablesService } from '@/lib/monite-api/demo-data-generator/receivables.service';
import { VatRatesService } from '@/lib/monite-api/demo-data-generator/vatRates.service';
import type { AccessToken } from '@/lib/monite-api/fetch-token';
import { components } from '@/lib/monite-api/schema';

import { generateBankAccount } from './generate-bank-account';
import { generateCounterpartsWithPayables } from './generate-payables';

export const generateEntity = async (
  { entity_id }: Record<'entity_id', string>,
  { logger, token }: { token: AccessToken; logger: ILogger }
) => {
  const serviceConstructorProps = {
    token,
    entityId: entity_id,
    logger,
  };

  try {
    logger({ message: 'Start generating demo-data..' });

    await generateBankAccount({
      entity_id,
      token,
    });

    logger({ message: 'Generating bank account...' });

    const { counterparts } = await new CounterpartsService(
      serviceConstructorProps
    ).create();

    await generateCounterpartsWithPayables(
      {
        entity_id,
        token,
      },
      {
        payable_count: 10,
        counterpart_count: 15,
        logger: logger,
      }
    );

    const currency = getRandomItemFromArray([
      'EUR',
      'USD',
      'GBP',
    ] satisfies Array<components['schemas']['CurrencyEnum']>);

    const vatService = new VatRatesService(serviceConstructorProps);
    const vatRates = await vatService.getAll();

    const measureUnitsService = new MeasureUnitsService(
      serviceConstructorProps
    );
    const measureUnits = await measureUnitsService.create();

    const productsService = new ProductsService(serviceConstructorProps);
    const products = await productsService
      .withOptions({
        measureUnits,
        currency,
      })
      .create();

    const receivablesService = new ReceivablesService(serviceConstructorProps);
    await receivablesService
      .withOptions({
        products,
        counterparts,
        vatRates,
        currency,
      })
      .create();

    logger({ success: 'Demo-data has been generated' });
  } catch (error) {
    logger({ error: 'Error when generating demo data' });

    console.error(
      `Error generating demo-data for entity_id "${entity_id}"`,
      error
    );
  }
};

export const generateEntityAddress = (): Omit<
  components['schemas']['EntityAddressSchema'],
  'country'
> => ({
  city: faker.location.city(),
  postal_code: faker.location.zipCode(),
  state: faker.location.state(),
  line1: faker.location.streetAddress(false),
  line2: faker.location.secondaryAddress(),
});
