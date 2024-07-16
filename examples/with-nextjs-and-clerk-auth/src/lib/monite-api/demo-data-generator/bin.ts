#!/usr/bin/env node
import chalk from 'chalk';
import { Command, program } from 'commander';
import dotenv from 'dotenv';

import { clerkClient } from '@clerk/clerk-sdk-node';
import { faker } from '@faker-js/faker';

import { createOrganizationEntity } from '@/lib/clerk-api/create-organization-entity';
import { recreateOrganizationEntity } from '@/lib/clerk-api/recreate-organization-entity';
import {
  createEntityRole,
  createEntityRoles,
  isExistingRole,
  permissionsAdapter,
  roles_default_permissions,
} from '@/lib/monite-api/create-entity-role';
import { createEntityUser } from '@/lib/monite-api/create-entity-user';
import { CounterpartsService } from '@/lib/monite-api/demo-data-generator/counterparts';
import { EntityService } from '@/lib/monite-api/demo-data-generator/entity.service';
import { getRandomItemFromArray } from '@/lib/monite-api/demo-data-generator/general.service';
import { generateApprovalPolicies } from '@/lib/monite-api/demo-data-generator/generate-approval-policies';
import { generateBankAccount } from '@/lib/monite-api/demo-data-generator/generate-bank-account';
import { generateEntity } from '@/lib/monite-api/demo-data-generator/generate-entity';
import { generateCounterpartsWithPayables } from '@/lib/monite-api/demo-data-generator/generate-payables';
import { MeasureUnitsService } from '@/lib/monite-api/demo-data-generator/measure-units.service';
import { PaymentTermsService } from '@/lib/monite-api/demo-data-generator/paymentTerms.service';
import { ProductsService } from '@/lib/monite-api/demo-data-generator/products.service';
import { ReceivablesService } from '@/lib/monite-api/demo-data-generator/receivables.service';
import { VatRatesService } from '@/lib/monite-api/demo-data-generator/vatRates.service';
import { type AccessToken, fetchToken } from '@/lib/monite-api/fetch-token';
import { components } from '@/lib/monite-api/schema';
import { updateEntityUser } from '@/lib/monite-api/update-entity-user';
import { createMqttMessenger } from '@/lib/mqtt/create-mqtt-messenger';


dotenv.config({ path: '.env.local', override: false });
dotenv.config({ path: '.env', override: false });

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
      .name('run')
      .description('Generate demo data for the existing Entity')
      .action(async (args) => {
        const token = await fetchTokenCLI(args);

        const { id: newEntityId } = await createOrganizationEntity(
          {
            email: faker.internet.email(),
            legal_name: faker.company.name(),
          },
          token
        );

        await generateEntityDemoData(newEntityId, token);
      })
  )
  .addCommand(
    new Command()
      .name('entity')
      .description('Create a new Entity')
      .option(
        '--generate-demo-data',
        'Generate demo data for the new entity',
        true
      )
      .option('--client-id <ID>', 'The client_id to use', String)
      .option('--client-secret <ID>', 'The client_secret to use', String)
      .action(async (args) => {
        const token = await fetchTokenCLI(args);

        console.log(chalk.gray('Creating a new Entity with a few users...'));

        const { id: newEntityId } = await createOrganizationEntity(
          {
            email: faker.internet.email(),
            legal_name: faker.company.name(),
          },
          token
        );

        console.log(
          chalk.greenBright(`🏢 Created new entity_id: "${newEntityId}"`)
        );

        console.log(
          chalk.gray(
            'Generating entity user role with permissions for the new entity...'
          )
        );

        const entityRoles = await createEntityRoles(
          newEntityId,
          Object.keys(roles_default_permissions).filter(isExistingRole),
          token
        );

        console.log(
          chalk.greenBright(
            `👥 Created new entity roles for the new entity_id:`
          ),
          chalk.bgGreen(`${newEntityId}`)
        );

        console.log(
          chalk.gray('Generating entity users for the new entity...')
        );
        for (const [role, role_id] of Object.entries(entityRoles)) {
          const { id } = await createEntityUser(
            {
              entity_id: newEntityId,
              user: {
                role_id,
                login: faker.internet.userName(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                phone: faker.phone.number().slice(0, 15),
              },
            },
            token
          ).catch((error) => {
            console.log(
              chalk.red(
                `Failed to create new entity_user with role: "${role}"`,
                `${JSON.stringify(error)}`
              )
            );

            return { id: null };
          });

          if (id)
            console.log(
              chalk.greenBright(
                `👤 Created new entity_user_id: "${id}" with role: "${role}"`
              )
            );
        }

        if (args.generateDemoData)
          await generateEntityDemoData(newEntityId, token);
        else
          console.log(
            chalk.gray(
              `Skipping demo data generation for the new entity_id: "${newEntityId}"`
            )
          );
      })
  )
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

        const entitiesService = new EntityService(serviceConstructorProps);
        const entityVats = await entitiesService.createVatIds();
        await entitiesService.createBankAccounts();

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
        await measureUnitsService.create();
        const measureUnits = await measureUnitsService.getAll();

        const paymentTermsService = new PaymentTermsService(
          serviceConstructorProps
        );
        const paymentTerms = await paymentTermsService
          .withOptions({ count: 3 })
          .create();

        console.log(chalk.black.bgBlueBright(`- Preparing fetch products`));
        const productsService = new ProductsService(serviceConstructorProps);
        const products = await productsService
          .withOptions({
            count: 10,
            measureUnits,
            currency,
            type: 'product',
          })
          .create();
        const services = await productsService
          .withOptions({
            count: 10,
            measureUnits,
            currency,
            type: 'service',
          })
          .create();

        /** Merge products & services */
        const lineItems = [...products, ...services];

        console.log(chalk.black.bgBlueBright(`- Preparing fetch receivables`));
        const receivablesService = new ReceivablesService(
          serviceConstructorProps
        );

        /** Create 15'ing Receivables with a type `invoice` */
        const invoices = await receivablesService
          .withOptions({
            products: lineItems,
            counterparts,
            vatRates,
            currency,
            entityVats,
            paymentTerms,
            type: 'invoice',
            count: 15,
          })
          .create();

        /** Create 15'ing Receivables with a type `credit_note` */
        await receivablesService
          .withOptions({
            products: lineItems,
            counterparts,
            vatRates,
            currency,
            entityVats,
            paymentTerms,
            type: 'quote',
            count: 15,
          })
          .create();

        await receivablesService.issueReceivables(invoices);
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
      .name('recreate-clerk-organization-entity')
      .description(
        'Recreate the Clerk Organization Entity with the same data and migrate users to the new Entity'
      )
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

        if (args.generateDemoData)
          await generateEntityDemoData(newEntityId, token);
        else
          console.log(
            chalk.gray(
              `Skipping demo data generation for the new entity_id: "${newEntityId}"`
            )
          );
      })
  )
  .addCommand(
    commandWithEntityOptions()
      .name('entity-user-role')
      .description('Generate entity user role with permissions')
      .requiredOption<keyof typeof roles_default_permissions>(
        '--role <ROLE>',
        `The default role permissions set to use. Available roles: ${Object.keys(
          roles_default_permissions
        ).join(', ')}`,
        (role) => {
          if (isExistingRole(role)) return role;
          throw new Error(
            `Invalid role, available roles: ${Object.keys(
              roles_default_permissions
            ).join(', ')}`
          );
        }
      )
      .option('--role-name <NAME>', 'The role name to create', String)
      .option(
        '--target-entity-user-id <ID>',
        'The user to whom a new role is assigned',
        String
      )
      .option('--new-entity-user', 'Create a new entity user')
      .action(async (args) => {
        const { entity_id } = getEntityArgs(args);
        const token = await fetchTokenCLI(args);
        const role = args.role;
        const targetEntityUserId = args.targetEntityUserId;
        const newEntityUser = args.newEntityUser;
        if (!entity_id) throw new Error('entity_id is empty');
        if (!isExistingRole(role)) throw new Error('role is not valid');
        if (!targetEntityUserId && !newEntityUser)
          throw new Error(
            'Either `--target-entity-user-id` or `--new-entity-user` must be set'
          );
        if (targetEntityUserId && newEntityUser)
          throw new Error(
            'Both `--target-entity-user-id` and `--new-entity-user` are set'
          );

        console.log(
          chalk.greenBright(
            `Generating entity user role with permissions for entity_id: "${entity_id}" and role: "${role}"...`
          )
        );

        console.log(chalk.gray(`Creating role: "${role}"...`));

        try {
          const { id: newRoleId } = await createEntityRole(
            {
              entity_id,
              role: {
                name: args.roleName ?? role,
                permissions: permissionsAdapter(
                  roles_default_permissions[role]
                ),
              },
            },
            token
          );

          if (targetEntityUserId) {
            console.log(
              chalk.gray(
                `Updating entity_user_id "${targetEntityUserId}" with role_id: "${newRoleId}"...`
              )
            );

            await updateEntityUser(
              {
                entity_id,
                entity_user_id: targetEntityUserId,
                user: { role_id: newRoleId },
              },
              token
            );

            console.log(
              chalk.greenBright(
                `Updated user role for entity_user_id: "${targetEntityUserId}"`
              )
            );
          } else if (newEntityUser) {
            console.log(chalk.gray(`Creating new entity user...`));

            const { id: newEntityUserId } = await createEntityUser(
              {
                entity_id,
                user: {
                  login: faker.internet.userName(),
                  role_id: newRoleId,
                  first_name: faker.person.firstName(),
                  last_name: faker.person.lastName(),
                  phone: faker.phone.number().slice(0, 15),
                  email: faker.internet.email(),
                },
              },
              token
            );

            console.log(
              chalk.greenBright(
                `Created new entity_user_id: "${newEntityUserId}" with role_id: "${newRoleId}"`
              )
            );
          }
        } catch (error) {
          console.error(
            chalk.red('Failed to create role or update user'),
            error
          );
        }
      })
  )
  .addCommand(
    commandWithEntityOptions()
      .name('approval-policies')
      .description('Generate Approval Policies for the entity_id')
      .action(async (args) => {
        const { entity_id, entity_user_id } = getEntityArgs(args);
        if (!entity_id) throw new Error('entity_id is empty');
        if (!entity_user_id) {
          console.error(
            chalk.red(
              'The "--entity-user-id" is required to generate Approval Policies'
            )
          );
          process.exit(1);
        }

        const token = await fetchTokenCLI(args);
        await generateApprovalPolicies({
          entity_id,
          entity_user_id,
          token: token,
        });
      })
  );

/**
 * Starts generating demo data for the Entity and sends messages to the MQTT
 * The messages are used to display the progress of the generation in frontend
 *
 * Generates demo Payables, Receivables, Counterparts, etc.
 * Does not generate Entity Users and Roles
 */
const generateEntityDemoData = async (
  entity_id: string,
  token: AccessToken
) => {
  if (!entity_id) throw new Error('"entity_id" is for demo data generation');

  console.log(
    chalk.greenBright(
      `Generating demo data for the new entity_id: "${entity_id}"...`
    )
  );

  const { publishMessage, closeMqttConnection } = createMqttMessenger(
    `demo-data-generation-log/${entity_id}`
  );

  await generateEntity(
    { entity_id: entity_id },
    {
      logger: publishMessage,
      token,
    }
  ).finally(() => void closeMqttConnection());
};

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
