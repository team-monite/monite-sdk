import chalk from 'chalk';

import { createBankAccount } from '@/lib/monite-api/demo-data-generator/bank-account';
import { AccessToken } from '@/lib/monite-api/fetch-token';

export const generateBankAccount = async ({
  token,
  entity_id,
}: {
  token: AccessToken;
  entity_id: string;
}) => {
  console.log(
    chalk.green(
      `Creating bank account for entity_id: "${entity_id}" and setting it as default`
    )
  );

  const bankAccount = await createBankAccount({
    is_default_for_currency: true,
    entity_id,
    token,
  });

  console.log(
    chalk.black.bgGreenBright(
      `✅ Created Bank Account 🏦 for entity_id: "${entity_id}" and set as default`
    )
  );

  return bankAccount;
};
