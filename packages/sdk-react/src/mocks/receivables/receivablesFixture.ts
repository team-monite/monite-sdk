import { bankAccountsFixture } from '@/mocks/bankAccounts';
import {
  counterpartsAddressesFixture,
  generateCounterpartAddress,
} from '@/mocks/counterparts/address/counterpartsAddressesFixture';
import { entityVatIdList } from '@/mocks/entities';
import { paymentTermsFixtures } from '@/mocks/paymentTerms';
import { vatRatesFixture } from '@/mocks/vatRates';
import {
  getRandomItemFromArray,
  getRandomNumber,
  getRandomProperty,
} from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import {
  AllowedCountries,
  CounterpartType,
  CreditNoteResponsePayload,
  CreditNoteStateEnum,
  CurrencyEnum,
  ReceivablesEntityIndividual,
  ReceivablesEntityOrganization,
  InvoiceResponsePayload,
  QuoteResponsePayload,
  QuoteStateEnum,
  ReceivablesStatusEnum,
  ResponseItem,
} from '@monite/sdk-api';

import { counterpartListFixture } from '../counterparts/counterpart/counterpartFixture';
import { counterpartVatsByCounterpartIdFixture } from '../counterparts/vat/counterpartVatFixture';

export type ReceivablesListFixture = {
  quote: Array<QuoteResponsePayload>;
  invoice: Array<InvoiceResponsePayload>;
  credit_note: Array<CreditNoteResponsePayload>;
};

function createRandomEntity():
  | ReceivablesEntityOrganization
  | ReceivablesEntityIndividual {
  const isOrganization = faker.datatype.boolean();

  if (isOrganization) {
    const organization: ReceivablesEntityOrganization = {
      type: ReceivablesEntityOrganization.type.ORGANIZATION,
      email: faker.internet.email(),
      phone: faker.phone.number(),
      name: faker.company.name(),
    };

    return organization;
  } else {
    const individual: ReceivablesEntityIndividual = {
      type: ReceivablesEntityIndividual.type.INDIVIDUAL,
      email: faker.internet.email(),
      phone: faker.phone.number(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    };

    return individual;
  }
}

function createRandomInvoiceEntity():
  | ReceivablesEntityOrganization
  | ReceivablesEntityIndividual {
  const isOrganization = faker.datatype.boolean();

  if (isOrganization) {
    const organization: ReceivablesEntityOrganization = {
      phone: faker.phone.number(),
      logo: faker.image.avatar(),
      email: faker.internet.email(),
      name: faker.company.name(),
      tax_id: faker.string.uuid(),
      vat_id: faker.string.uuid(),
      type: ReceivablesEntityOrganization.type.ORGANIZATION,
    };

    return organization;
  } else {
    const individual: ReceivablesEntityIndividual = {
      phone: faker.phone.number(),
      logo: faker.image.avatar(),
      email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      tax_id: faker.string.uuid(),
      type: ReceivablesEntityIndividual.type.INDIVIDUAL,
    };

    return individual;
  }
}

function createRandomLineItem(): ResponseItem {
  const productVatId = getRandomItemFromArray(vatRatesFixture.data);

  return {
    quantity: faker.number.int({ min: 1, max: 10 }),
    product: {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: {
        value: faker.number.int({ min: 10, max: 30_000 }),
        currency: CurrencyEnum.EUR,
      },
      measure_unit_id: faker.string.sample(),
      created_at: faker.date.past().toString(),
      entity_id: faker.string.uuid(),
      updated_at: faker.date.past().toString(),
      vat_rate: {
        id: productVatId.id,
        created_at: productVatId.created_at,
        updated_at: productVatId.updated_at,
        value: productVatId.value,
        country: productVatId.country,
      },
      measure_unit: {
        id: faker.string.nanoid(),
        name: faker.commerce.productName(),
        created_at: faker.date.past().toString(),
        updated_at: faker.date.past().toString(),
      },
    },
  };
}

function createRandomQuote(): QuoteResponsePayload {
  return {
    type: QuoteResponsePayload.type.QUOTE,
    id: faker.string.uuid(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    document_id: `quote--${faker.string.nanoid(20)}`,
    expiry_date: faker.date.future().toString(),
    issue_date: faker.date.past().toString(),
    currency: getRandomProperty(CurrencyEnum),
    line_items: [],
    entity_address: {
      country: AllowedCountries.DE,
      city: 'string',
      postal_code: 'string',
      state: 'string',
      line1: 'string',
      line2: 'string',
    },
    counterpart_id: faker.string.uuid(),
    counterpart_name: faker.company.name(),
    counterpart_type: CounterpartType.INDIVIDUAL,
    counterpart_address: {
      country: AllowedCountries.DE,
      city: 'Berlin',
      postal_code: '10115',
      state: 'string',
      line1: 'Flughafenstrasse 52',
      line2: 'string',
    },
    total_vat_amount: faker.number.int(),
    total_amount: Number(faker.commerce.price()),
    entity: createRandomEntity(),
    status: getRandomProperty(QuoteStateEnum),
  };
}

function returnIfDraft(status: ReceivablesStatusEnum) {
  return function <T>(value: T) {
    return status === ReceivablesStatusEnum.DRAFT ? undefined : value;
  };
}

function createRandomInvoice(index: number): InvoiceResponsePayload {
  const randomExistingCounterpart = getRandomItemFromArray(
    counterpartListFixture
  );

  if (!randomExistingCounterpart) {
    throw new Error('No counterpart found');
  }

  const status =
    index === 0
      ? ReceivablesStatusEnum.DRAFT
      : getRandomProperty(ReceivablesStatusEnum);
  const counterpartType = getRandomProperty(CounterpartType);
  const rid = returnIfDraft(status);

  const lineItems = new Array(getRandomNumber(1, 15))
    .fill('_')
    .map(createRandomLineItem);

  const subtotal = lineItems.reduce((acc, item) => {
    const { product, quantity } = item;
    const { price } = product;
    if (price) {
      return acc + price.value * quantity;
    }

    return acc;
  }, 0);

  const totalVatAmount =
    subtotal -
    lineItems.reduce((acc, item) => {
      const { product, quantity } = item;
      const { price, vat_rate } = product;
      if (price && vat_rate) {
        return acc + price.value * quantity * (vat_rate.value / 10_000);
      }

      return acc;
    }, 0);

  const discount = faker.number.int({
    max: subtotal / 10,
  });

  const total = subtotal - discount + totalVatAmount;

  const entityVatIds = Object.values(entityVatIdList)[0];

  /** Take only addresses which related to the current counterpart */
  const flatCounterpartAddresses = counterpartsAddressesFixture.flatMap(
    (item) => item.data
  );
  const counterpartAddresses = flatCounterpartAddresses.filter(
    (address) => address.counterpart_id === randomExistingCounterpart.id
  );
  const counterpartAddress = getRandomItemFromArray(counterpartAddresses);

  return {
    type: InvoiceResponsePayload.type.INVOICE,
    id: faker.string.uuid(),
    amount_paid: faker.number.int(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    document_id: rid(`INV-${faker.string.nanoid(20)}`),
    issue_date: rid(faker.date.past().toString()),
    fulfillment_date: faker.date.future().toString(),
    payment_terms: getRandomItemFromArray(paymentTermsFixtures.data!),
    currency: CurrencyEnum.EUR,
    line_items: new Array(getRandomNumber(1, 15))
      .fill('_')
      .map(createRandomLineItem),
    counterpart_id: randomExistingCounterpart.id,
    counterpart_name:
      counterpartType === CounterpartType.ORGANIZATION
        ? faker.company.name()
        : undefined,
    counterpart_type: counterpartType,
    counterpart_tax_id: faker.datatype.boolean()
      ? faker.string.numeric(10)
      : undefined,
    counterpart_vat_id: faker.datatype.boolean()
      ? getRandomItemFromArray(
          counterpartVatsByCounterpartIdFixture[randomExistingCounterpart.id]
        )
      : undefined,
    counterpart_billing_address: generateCounterpartAddress(),
    counterpart_shipping_address: counterpartAddress,
    counterpart_contact: faker.datatype.boolean()
      ? {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          address: {
            country: getRandomProperty(AllowedCountries),
            city: faker.location.city(),
            postal_code: faker.location.zipCode(),
            state: faker.location.state(),
            line1: faker.location.street(),
            line2: faker.location.streetAddress(),
          },
        }
      : undefined,
    counterpart_address: {
      country: getRandomProperty(AllowedCountries),
      city: faker.location.city(),
      postal_code: faker.location.zipCode(),
      state: faker.location.state(),
      line1: faker.location.street(),
      line2: faker.location.streetAddress(),
    },
    amount_due: faker.number.int({ max: 10_000 }),
    entity: createRandomInvoiceEntity(),
    entity_vat_id: getRandomItemFromArray(entityVatIds.data),
    entity_address: generateCounterpartAddress(),
    memo: faker.lorem.sentence(),
    entity_bank_account: faker.datatype.boolean()
      ? getRandomItemFromArray(bankAccountsFixture.data)
      : undefined,
    related_documents: {
      credit_note_ids: undefined,
      proforma_invoice_id: undefined,
    },
    status,

    purchase_order: faker.datatype.boolean()
      ? faker.string.uuid().substring(0, 6)
      : undefined,
    subtotal: subtotal,
    discounted_subtotal: discount,
    total_vat_amount: totalVatAmount,
    total_amount_with_credit_notes: total,
  };
}

function createRandomCreditNote(): CreditNoteResponsePayload {
  return {
    type: CreditNoteResponsePayload.type.CREDIT_NOTE,
    id: faker.string.uuid(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    document_id: `credit_note--${faker.string.nanoid(20)}`,
    issue_date: faker.date.past().toString(),
    currency: getRandomProperty(CurrencyEnum),
    line_items: [],
    entity_address: {
      country: AllowedCountries.DE,
      city: 'string',
      postal_code: 'string',
      state: 'string',
      line1: 'string',
      line2: 'string',
    },
    counterpart_id: faker.string.uuid(),
    counterpart_name: faker.company.name(),
    counterpart_type: CounterpartType.INDIVIDUAL,
    counterpart_address: {
      country: AllowedCountries.DE,
      city: 'Berlin',
      postal_code: '10115',
      state: 'string',
      line1: 'Flughafenstrasse 52',
      line2: 'string',
    },
    total_vat_amount: faker.number.int(),
    total_amount: Number(faker.commerce.price()),
    entity: createRandomEntity(),
    status: getRandomProperty(CreditNoteStateEnum),
  };
}

export const receivableListFixture: ReceivablesListFixture = {
  quote: Array.from(Array(30).keys()).map(createRandomQuote),
  invoice: Array.from(Array(30).keys()).map(createRandomInvoice),
  credit_note: Array.from(Array(30).keys()).map(createRandomCreditNote),
};
