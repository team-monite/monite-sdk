import chalk from 'chalk';

import { faker } from '@faker-js/faker';

import {
  getMoniteApiVersion,
  MoniteClient,
} from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';

export type PayableCounterpart = {
  counterpart_id: string;
  counterpart_vat_id: string;
  counterpart_bank: {
    id: string;
    currency: components['schemas']['CurrencyEnum'];
  };
};

export const createPayable = async ({
  moniteClient,
  counterpart: { counterpart_bank, ...counterpart },
  entity_id,
}: {
  moniteClient: MoniteClient;
  counterpart: PayableCounterpart;
  entity_id: string;
}) => {
  const { data, error, response } = await moniteClient.POST('/payables', {
    params: {
      header: {
        'x-monite-version': getMoniteApiVersion(),
        'x-monite-entity-id': entity_id,
      },
    },
    body: {
      currency: counterpart_bank.currency,
      counterpart_bank_account_id: counterpart_bank.id,
      counterpart_id: counterpart.counterpart_id,
      counterpart_vat_id_id: counterpart.counterpart_vat_id,
      issued_at: faker.date.past({ years: 2 }).toISOString().split('T')[0],
      due_date: faker.date.future({ years: 1 }).toISOString().split('T')[0],
      document_id: faker.string.alphanumeric({ length: 6, casing: 'upper' }),
    },
  });

  if (error) {
    console.error(
      `Failed to create payable for the counterpart_id: "${counterpart.counterpart_id}" in the entity_id: "${entity_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(`Payable create failed: ${JSON.stringify(error)}`);
  }

  return data;
};

export const createPayableLineItems = async ({
  moniteClient,
  payable_id,
  entity_id,
}: {
  moniteClient: MoniteClient;
  payable_id: string;
  entity_id: string;
}) => {
  const quantity = faker.number.int({ min: 1, max: 10 });
  const unit_price = 100 * faker.number.int({ min: 150, max: 80000 });
  const tax = 100 * faker.number.int({ min: 1, max: 35 });

  console.log(
    chalk.gray(
      `Creating payable line item with quantity: ${quantity}, unit_price: ${unit_price}, tax: ${tax}`
    )
  );

  const { data, error, response } = await moniteClient.POST(
    '/payables/{payable_id}/line_items',
    {
      params: {
        path: {
          payable_id,
        },
        header: {
          'x-monite-version': getMoniteApiVersion(),
          'x-monite-entity-id': entity_id,
        },
      },
      body: {
        name: faker.commerce.productName(),
        quantity,
        tax,
        unit_price,
        description: faker.commerce.productDescription(),
      },
    }
  );

  if (error) {
    console.error(
      `Failed to add line item to payable for the payable_id: "${payable_id}" in the entity_id: "${entity_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(
      `Payable line item create failed: ${JSON.stringify(error)}`
    );
  }

  return data;
};

export const approvePayablePaymentOperation = async ({
  moniteClient,
  payable_id,
  entity_id,
}: {
  moniteClient: MoniteClient;
  payable_id: string;
  entity_id: string;
}) => {
  const { data, error, response } = await moniteClient.POST(
    '/payables/{payable_id}/approve_payment_operation',
    {
      params: {
        path: {
          payable_id,
        },
        header: {
          'x-monite-version': getMoniteApiVersion(),
          'x-monite-entity-id': entity_id,
        },
      },
    }
  );

  if (error) {
    console.error(
      `Failed to approve payable payment operation for the payable_id: "${payable_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(
      `Approve payable payment operation failed: ${JSON.stringify(error)}`
    );
  }

  return data;
};
