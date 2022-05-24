#!/usr/bin/env node
import chalk from 'chalk';
import { Command, program } from 'commander';
import dotenv from 'dotenv';

import { clerkClient } from '@clerk/clerk-sdk-node';

import { recreateOrganizationEntity } from '@/lib/clerk-api/recreate-organization-entity';
import { CounterpartsService } from '@/lib/monite-api/demo-data-generator/counterparts';
import { getRandomItemFromArray } from '@/lib/monite-api/demo-data-generator/general.service';
import { generateBankAccount } from '@/lib/monite-api/demo-data-generator/generate-bank-account';
import { generateEntity } from '@/lib/monite-api/demo-data-generator/generate-entity';
import { generateCounterpartsWithPayables } from '@/lib/monite-api/demo-data-generator/generate-payables';
import { MeasureUnitsService } from '@/lib/monite-api/demo-data-generator/measure-units.service';
import { ProductsService } from '@/lib/monite-api/demo-data-generator/products.service';
import { ReceivablesService } from '@/lib/monite-api/demo-data-generator/receivables.service';
import { VatRatesService } from '@/lib/monite-api/demo-data-generator/vatRates.service';
import { fetchToken } from '@/lib/monite-api/fetch-token';
import { components } from '@/lib/monite-api/schema';
import { createMqttMessenger } from '@/lib/mqtt/create-mqtt-messenger';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

const commandWithEntityOptions = () =>
  new Command()
    .requiredOption(
      '--entity-id <ID>',
      'The entity_id to use for the demo data',
      String
    )
    .option('--client-id <ID>', 'The client_id to use', String)
    .option('--client-secret <ID>', 'The client_secret to use', String)
    .option('--entity-user-id <ID>', 'The entity_user_id to use', String);

program
  .addCommand(
    commandWithEntityOptions()
      .name('payables')
      .description('Generate counterparts, taxId, payables and line items')
      .option('--payable-count <COUNT>', 'Number of payables', Number, 1)
      .option(
        '--counterpart-count <COUNT>',
        'Number of counterparts',
        Number,
        1
      )
      .action(async (args) => {
        const { entity_id } = getEntityArgs(args);
        const payableCount = Number(args.payableCount) ?? 1;
        if (!isFinite(payableCount) || payableCount < 1) {
          console.error(
            chalk.red(`Invalid count "${args.count}" for payables`)
          );
          return;
        }
        const counterpartCount = Number(args.counterpartCount) ?? 1;
        if (!isFinite(counterpartCount) || counterpartCount < 1) {
          console.error(
            chalk.red(`Invalid count "${args.count}" for counterparts`)
          );
          return;
        }

        if (!entity_id) throw new Error('entity_id is empty');

        await generateCounterpartsWithPayables(
          {
            entity_id,
            token: await fetchTokenCLI(args),
          },
          {
            payable_count: payableCount,
            counterpart_count: counterpartCount,
          }
        );
      })
  )
  .addCommand(
    commandWithEntityOptions()
      .name('receivables')
      .description('Generate receivables')
      .action(async (args) => {
        const { entity_id } = getEntityArgs(args);

        if (!entity_id) throw new Error('entity_id is empty');

        const serviceConstructorProps = {
          token: await fetchTokenCLI(args),
          entityId: entity_id,
        };

        const currency = getRandomItemFromArray([
          'EUR',
          'USD',
          'GEL',
        ] satisfies Array<components['schemas']['CurrencyEnum']>);

        const counterpartsService = new CounterpartsService(
          serviceConstructorProps
        );
        const { counterparts } = await counterpartsService.create();

        const vatService = new VatRatesService(serviceConstructorProps);
        const vatRates = await vatService.getAll();

        console.log(
          chalk.black.bgBlueBright(`- Preparing fetch measure units`)
        );
        const measureUnitsService = new MeasureUnitsService(
          serviceConstructorProps
        );
        const measureUnits = await measureUnitsService.create();

        console.log(chalk.black.bgBlueBright(`- Preparing fetch products`));
        const productsService = new ProductsService(serviceConstructorProps);
        const products = await productsService
          .withOptions({
            measureUnits,
            currency,
          })
          .create();

        console.log(chalk.black.bgBlueBright(`- Preparing fetch receivables`));
        const receivablesService = new ReceivablesService(
          serviceConstructorProps
        );

        await receivablesService
          .withOptions({
            products,
            counterparts,
            vatRates,
            currency,
          })
          .create();
      })
  )
  .addCommand(
    commandWithEntityOptions()
      .name('bank-account')
      .description('Generate bank accounts for the entity_id and set default')
      .action(async (args) => {
        const { entity_id } = getEntityArgs(args);
        if (!entity_id) throw new Error('entity_id is empty');

        await generateBankAccount({
          entity_id,
          token: await fetchTokenCLI(args),
        });
      })
  )
  .addCommand(
    new Command()
      .name('recreate-organization-entity')
      .requiredOption(
        '--organization-id <ID>',
        'The Clerk Organization ID to migrate users to new Entity (required)'
      )
      .option('--generate-demo-data', 'Generate demo data for the new entity')
      .option('--client-id <ID>', 'The client_id to use', String)
      .option('--client-secret <ID>', 'The client_secret to use', String)
      .description('Migration of users from one Entity to another')
      .action(async (args) => {
        const token = await fetchTokenCLI(args);

        const { entity_id: newEntityId } = await recreateOrganizationEntity({
          organizationId: args.organizationId,
          token,
          clerkClient,
        });

        if (!newEntityId)
          throw new Error('"entity_id" is not set after migration');

        if (!args.generateDemoData)
          return void console.log(
            chalk.gray(
              `Skipping demo data generation for the new entity_id: "${newEntityId}"`
            )
          );

        console.log(
          chalk.greenBright(
            `Generating demo data for the new entity_id: "${newEntityId}"...`
          )
        );

        const { publishMessage, closeMqttConnection } = createMqttMessenger(
          `demo-data-generation-log/${newEntityId}`
        );

        await generateEntity(
          { entity_id: newEntityId },
          {
            logger: publishMessage,
            token,
          }
        ).finally(() => void closeMqttConnection());
      })
  );

const getEntityArgs = (options: Record<string, string | undefined>) => {
  const entity_id = options.entityId;
  const client_id = options.clientId ?? process.env.MONITE_PROJECT_CLIENT_ID;
  const client_secret =
    options.clientSecret ?? process.env.MONITE_PROJECT_CLIENT_SECRET;
  if (!client_id) throw new Error('MONITE_PROJECT_CLIENT_ID is not set');
  if (!client_secret)
    throw new Error('MONITE_PROJECT_CLIENT_SECRET is not set');
  const entity_user_id = options.entityUserId;

  return {
    entity_id,
    client_id,
    client_secret,
    entity_user_id,
  };
};

const fetchTokenCLI = async (args: Parameters<typeof getEntityArgs>[0]) => {
  const { client_id, client_secret, entity_user_id } = getEntityArgs(args);

  console.log(
    chalk.green(
      entity_user_id
        ? `Fetching token for entity_user_id: "${entity_user_id}" and grant_type: "entity_user"`
        : `Fetching token for client_id: "${client_id}" grant_type: "client_credentials"`
    )
  );

  return await fetchToken({
    client_id,
    client_secret,
    ...(entity_user_id
      ? { entity_user_id, grant_type: 'entity_user' }
      : {
          grant_type: 'client_credentials',
        }),
  });
};

program.parse(process.argv);
