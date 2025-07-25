import { components } from '@/api';
import { AllowedCountries } from '@/enums/AllowedCountries';
import { CreditNoteStateEnum } from '@/enums/CreditNoteStateEnum';
import { CurrencyEnum } from '@/enums/CurrencyEnum';
import { LanguageCodeEnum } from '@/enums/LanguageCodeEnum';
import { QuoteStateEnum } from '@/enums/QuoteStateEnum';
import { ReceivablesStatusEnum } from '@/enums/ReceivablesStatusEnum';
import { bankAccountsFixture } from '@/mocks/bankAccounts';
import {
  counterpartsAddressesFixture,
  generateCounterpartAddress,
} from '@/mocks/counterparts/address';
import { counterpartListFixture } from '@/mocks/counterparts/counterpart/counterpartFixture';
import { counterpartVatsByCounterpartIdFixture } from '@/mocks/counterparts/vat/counterpartVatFixture';
import { entityVatIdList } from '@/mocks/entities';
import { paymentTermsFixtures } from '@/mocks/paymentTerms';
import {
  overdueReminderListFixture,
  paymentReminderListFixture,
} from '@/mocks/reminders/reminderListFixtures';
import { vatRatesFixture } from '@/mocks/vatRates';
import {
  getRandomItemFromArray,
  getRandomNumber,
} from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';

export type ReceivablesListFixture = {
  quote: Array<components['schemas']['QuoteResponsePayload']>;
  invoice: Array<components['schemas']['InvoiceResponsePayload']>;
  credit_note: Array<components['schemas']['CreditNoteResponsePayload']>;
};

function createRandomEntity():
  | components['schemas']['ReceivableEntityOrganization']
  | components['schemas']['ReceivableEntityIndividual'] {
  const isOrganization = faker.datatype.boolean();

  if (isOrganization) {
    return {
      type: 'organization',
      email: faker.internet.email(),
      phone: faker.phone.number(),
      name: faker.company.name(),
    };
  } else {
    return {
      type: 'individual',
      email: faker.internet.email(),
      phone: faker.phone.number(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    };
  }
}

function createRandomInvoiceEntity():
  | components['schemas']['ReceivableEntityOrganization']
  | components['schemas']['ReceivableEntityIndividual'] {
  const isOrganization = faker.datatype.boolean();

  if (isOrganization) {
    return {
      phone: faker.phone.number(),
      logo: faker.image.avatar(),
      email: faker.internet.email(),
      name: faker.company.name(),
      tax_id: faker.string.uuid(),
      vat_id: faker.string.uuid(),
      type: 'organization',
    };
  } else {
    return {
      phone: faker.phone.number(),
      logo: faker.image.avatar(),
      email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      tax_id: faker.string.uuid(),
      type: 'individual',
    };
  }
}

function createRandomLineItem(): components['schemas']['ResponseItem'] {
  const productVatId = getRandomItemFromArray(vatRatesFixture.data);

  const quantity = faker.number.int({ min: 1, max: 10 });
  const totalBeforeVat = faker.number.int({ min: 10, max: 30_000 });
  const vatRateValue = productVatId.value / 100;

  return {
    quantity,
    total_before_vat: totalBeforeVat,
    total_after_vat: totalBeforeVat + totalBeforeVat * vatRateValue,
    product: {
      id: faker.string.uuid(),
      type: 'product',
      name: faker.commerce.productName(),
      price: {
        value: faker.number.int({ min: 10, max: 30_000 }),
        currency: 'EUR',
      },
      price_after_vat: {
        value: faker.number.int({ min: 10, max: 30_000 }),
        currency: 'EUR',
      },
      vat_rate: {
        is_custom: false,
        id: productVatId.id,
        value: vatRateValue,
        country: productVatId.country,
      },
      measure_unit: {
        id: faker.string.nanoid(),
        description: faker.commerce.productName(),
        name: faker.commerce.productName(),
      },
      is_inline: false,
    },
  };
}

function createRandomQuote(): components['schemas']['QuoteResponsePayload'] {
  return {
    type: 'quote',
    id: faker.string.uuid(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    vat_inclusive_discount_mode: 'inclusive',
    document_id: `quote--${faker.string.nanoid(20)}`,
    expiry_date: faker.date.future().toString(),
    issue_date: faker.date.past().toString(),
    currency: getRandomItemFromArray(CurrencyEnum),
    file_language: getRandomItemFromArray(LanguageCodeEnum),
    original_file_language: getRandomItemFromArray(LanguageCodeEnum),
    line_items: [],
    entity_address: {
      country: 'DE',
      city: 'string',
      postal_code: 'string',
      state: 'string',
      line1: 'string',
      line2: 'string',
    },
    counterpart_id: faker.string.uuid(),
    counterpart_name: faker.company.name(),
    counterpart_type: 'individual',
    counterpart_billing_address: {
      country: 'DE',
      city: 'Berlin',
      postal_code: '10115',
      state: 'string',
      line1: 'Flughafenstrasse 52',
      line2: 'string',
    },
    total_vat_amount: faker.number.int(),
    total_amount: Number(faker.commerce.price()),
    entity: createRandomEntity(),
    status: getRandomItemFromArray(QuoteStateEnum),
    tags: [],
    vat_mode: 'exclusive',
  };
}

function createRandomInvoice(
  index: number
): components['schemas']['InvoiceResponsePayload'] {
  const randomExistingCounterpart = getRandomItemFromArray(
    counterpartListFixture
  );

  if (!randomExistingCounterpart) {
    throw new Error('No counterpart found');
  }

  const status: components['schemas']['ReceivablesStatusEnum'] =
    index === 0
      ? 'draft'
      : index === 1
      ? 'issued' // 'not renders action menu if onRowAction property is not specified' test depends there is an invoice with a non-draft status on the first screen
      : getRandomItemFromArray(ReceivablesStatusEnum);

  const counterpart_type = getRandomItemFromArray<
    components['schemas']['CounterpartType']
  >(['individual', 'organization']);

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

  const id = faker.string.uuid();

  return {
    type: 'invoice',
    id,
    vat_inclusive_discount_mode: 'inclusive',
    amount_paid: faker.number.int(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    document_id:
      status !== 'draft' ? `INV-${faker.string.nanoid(20)}` : undefined,
    issue_date: status !== 'draft' ? faker.date.past().toString() : undefined,
    recurrence_id: status === 'recurring' ? faker.string.uuid() : undefined,
    based_on: id,
    fulfillment_date: faker.date.future().toString(),
    payment_terms: getRandomItemFromArray(paymentTermsFixtures.data!),
    currency: 'EUR',
    line_items: new Array(getRandomNumber(1, 15))
      .fill('_')
      .map(createRandomLineItem),
    counterpart_id: randomExistingCounterpart.id,
    counterpart_name:
      counterpart_type === 'organization' ? faker.company.name() : undefined,
    counterpart_type,
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
            country: getRandomItemFromArray(AllowedCountries),
            city: faker.location.city(),
            postal_code: faker.location.zipCode(),
            state: faker.location.state(),
            line1: faker.location.street(),
            line2: faker.location.streetAddress(),
          },
        }
      : undefined,
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
    file_language: 'en',
    original_file_language: 'en',
    total_amount: Number(faker.commerce.price()),
    overdue_reminder_id: overdueReminderListFixture[0].id,
    payment_reminder_id: paymentReminderListFixture[0].id,
    tags: [],
    vat_mode: 'exclusive',
    is_einvoice: false,
  };
}

function createRandomCreditNote(): components['schemas']['CreditNoteResponsePayload'] {
  return {
    type: 'credit_note',
    id: faker.string.uuid(),
    vat_inclusive_discount_mode: 'inclusive',
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    document_id: `credit_note--${faker.string.nanoid(20)}`,
    issue_date: faker.date.past().toString(),
    currency: getRandomItemFromArray(CurrencyEnum),
    file_language: getRandomItemFromArray(LanguageCodeEnum),
    original_file_language: getRandomItemFromArray(LanguageCodeEnum),
    line_items: [],
    entity_address: {
      country: 'DE',
      city: 'string',
      postal_code: 'string',
      state: 'string',
      line1: 'string',
      line2: 'string',
    },
    counterpart_id: faker.string.uuid(),
    counterpart_name: faker.company.name(),
    counterpart_type: 'individual',
    counterpart_billing_address: {
      country: 'DE',
      city: 'Berlin',
      postal_code: '10115',
      state: 'string',
      line1: 'Flughafenstrasse 52',
      line2: 'string',
    },
    total_vat_amount: faker.number.int(),
    total_amount: Number(faker.commerce.price()),
    entity: createRandomEntity(),
    status: getRandomItemFromArray(CreditNoteStateEnum),
    tags: [],
    vat_mode: 'exclusive',
  };
}

export const receivableListFixture: ReceivablesListFixture = {
  quote: Array.from(Array(30).keys()).map(createRandomQuote),
  invoice: Array.from(Array(30).keys()).map(createRandomInvoice),
  credit_note: Array.from(Array(30).keys()).map(createRandomCreditNote),
};

function createRandomContact(): components['schemas']['CounterpartContactResponse'] {
  return {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    is_default: faker.datatype.boolean(),
    counterpart_id: faker.string.uuid(),
    address: {
      country: getRandomItemFromArray(AllowedCountries),
      city: faker.location.city(),
      postal_code: faker.location.zipCode(),
      state: faker.location.state(),
      line1: faker.location.streetAddress(),
      line2: faker.location.secondaryAddress(),
    },
  };
}

function createRandomPreview(): components['schemas']['ReceivablePreviewResponse'] {
  return {
    body_preview: `<html>
      <body>
        <h1>${faker.company.name()}</h1>
        <p>${faker.lorem.paragraphs(2)}</p>
        <p>Best regards,<br/>${faker.person.fullName()}</p>
      </body>
    </html>`,
    subject_preview: `Invoice ${faker.string.alphanumeric(
      8
    )} from ${faker.company.name()}`,
  };
}

export const receivableContactsFixture: Record<
  string,
  Array<components['schemas']['CounterpartContactResponse']>
> = receivableListFixture.invoice.reduce(
  (acc, invoice) => ({
    ...acc,
    [invoice.id]: Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      () => createRandomContact()
    ),
  }),
  {}
);

export const receivablePreviewFixture: Record<
  string,
  components['schemas']['ReceivablePreviewResponse']
> = receivableListFixture.invoice.reduce(
  (acc, invoice) => ({
    ...acc,
    [invoice.id]: createRandomPreview(),
  }),
  {}
);
