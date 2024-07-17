import chalk from 'chalk';

import { faker } from '@faker-js/faker';

import {
  createCounterpart,
  createCounterpartBankAccount,
  createCounterpartVatId,
} from '@/lib/monite-api/demo-data-generator/counterparts';
import {
  approvePayablePaymentOperation,
  createPayable,
  createPayableLineItems,
  PayableCounterpart,
} from '@/lib/monite-api/demo-data-generator/payables';
import { AccessToken } from '@/lib/monite-api/fetch-token';
import { createMoniteClient } from '@/lib/monite-api/monite-client';

export const generateCounterpartsWithPayables = async (
  {
    entity_id,
    token,
  }: {
    entity_id: string;
    token: AccessToken;
  },
  {
    payable_count,
    counterpart_count,
    logger,
  }: {
    payable_count: number;
    counterpart_count: number;
    logger?: (message: DemoDataGenerationMessage) => void;
  }
) => {
  const counterparts: PayableCounterpart[] = [];

  const moniteClient = createMoniteClient(token);
  const entity = await moniteClient.getEntity(entity_id);

  for (
    let counterpartIndex = 0;
    counterpartIndex < counterpart_count;
    counterpartIndex++
  ) {
    console.log(
      chalk.green(
        `Creating Counterpart (${counterpartIndex + 1}/${counterpart_count})`
      )
    );

    try {
      const counterpart = await createCounterpart({
        token,
        entity_id,
      });

      console.log(chalk.green('- Creating Counterpart Bank Account'));

      const counterpart_bank_account = await createCounterpartBankAccount({
        is_default_for_currency: true,
        counterpart_id: counterpart.id,
        token,
        entity_id,
      });

      console.log(chalk.green('- Creating Counterpart VAT ID'));

      const vat = await createCounterpartVatId({
        counterpart_id: counterpart.id,
        token,
        entity,
      });

      if (counterpart_bank_account?.id) {
        counterparts.push({
          counterpart_id: counterpart.id,
          counterpart_vat_id: vat.id,
          counterpart_bank: {
            id: counterpart_bank_account.id,
            currency: counterpart_bank_account.currency,
          },
        });

        logger?.({ message: 'Generating counterparts...' });
      } else {
        console.error('Counterpart bank account ID is not set');
      }
    } catch (error) {
      console.error(
        chalk.red(
          `Error creating counterpart (${
            counterpartIndex + 1
          }/${counterpart_count})`
        )
      );
      console.error(error);
    }
  }

  console.log(chalk.black.bgGreenBright(`✅ Created Counterparts 👤`));

  for (let payableIndex = 0; payableIndex < payable_count; payableIndex++) {
    try {
      await generatePayableWithLineItems({
        token,
        entity_id,
        counterparts,
      });

      console.log(
        chalk.black.bgGreenBright(
          `✅ Created payable 💰 (${payableIndex + 1}/${payable_count})`
        )
      );

      logger?.({ message: 'Generating payables...' });
    } catch (error) {
      console.error(
        chalk.red(
          `Error creating payable (${payableIndex + 1}/${payable_count})`
        )
      );
      console.error(error);
    }
  }
};

const generatePayableWithLineItems = async (
  {
    counterparts,
    ...entityParams
  }: {
    entity_id: string;
    token: AccessToken;
    counterparts: PayableCounterpart[];
  },
  {
    lineItems = {
      min: 1,
      max: 5,
    },
  }: {
    numberOfPayables?: number;
    lineItems?: {
      min: number;
      max: number;
    };
  } = {}
) => {
  const numberOfLineItems = faker.number.int({
    min: lineItems.min,
    max: lineItems.max,
  });

  const counterpart = counterparts.at(
    faker.number.int({ min: 0, max: counterparts.length - 1 })
  );

  if (!counterpart) throw new Error('Counterpart is not exists');

  console.log(
    chalk.bgBlue(
      `🪄 Creating Payable 💰 for Counterpart: ${counterpart.counterpart_id}`
    )
  );

  const payable = await createPayable({
    counterpart,
    ...entityParams,
  }).catch((error) => {
    console.error(
      chalk.red(
        `Failed to create payable for counterpart: ${counterpart.counterpart_id}`
      )
    );
    console.error(error);
    return null;
  });

  if (!payable) throw new Error('Payable is not exists');

  for (let i = 0; i <= numberOfLineItems - 1; i++) {
    console.log(
      chalk.green(
        `Creating payable line item for payable: ${payable.id} (${
          i + 1
        }/${numberOfLineItems})`
      )
    );

    const payableLineItem = await createPayableLineItems({
      payable_id: payable.id,
      ...entityParams,
    });

    console.log(
      chalk.gray(
        `Subtotal: ${payableLineItem.subtotal}, tax: ${payableLineItem.tax}, total: ${payableLineItem.total}`
      )
    );
  }

  if (faker.number.int({ min: 0, max: 10 }) < 3) {
    console.log(
      chalk.greenBright.bgCyanBright(
        `Approving payable payment operation for payable: ${payable.id}`
      )
    );

    await approvePayablePaymentOperation({
      payable_id: payable.id,
      ...entityParams,
    });
  } else {
    console.log(
      chalk.gray.bgCyanBright(
        `Skipping approving payable payment operation for payable: ${payable.id}`
      )
    );
  }
};

export type DemoDataGenerationMessage =
  | { message: string }
  | { error: string }
  | { success: string };
