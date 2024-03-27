import { counterpartListFixture } from '@/mocks';
import { generateCounterpartAddress } from '@/mocks/counterparts/address';
import { entityIds } from '@/mocks/entities';
import { generatePaymentTerm } from '@/mocks/paymentTerms';
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
  ProductServiceTypeEnum,
  QuoteResponsePayload,
  QuoteStateEnum,
  ReceivableResponse,
  ReceivablesStatusEnum,
  ResponseItem,
  VatIDTypeEnum,
} from '@monite/sdk-api';

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
  return {
    quantity: faker.number.int({ min: 1, max: 10 }),
    product: {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: faker.datatype.boolean(0.9)
        ? {
            value: faker.number.int({ min: 10, max: 30_000 }),
            currency: CurrencyEnum.EUR,
          }
        : undefined,
      measure_unit_id: faker.string.sample(),
      created_at: faker.date.past().toString(),
      entity_id: faker.string.uuid(),
      updated_at: faker.date.past().toString(),
      vat_rate: {
        id: faker.string.nanoid(),
        created_at: faker.date.past().toString(),
        updated_at: faker.date.past().toString(),
        value: faker.number.int({
          /**
           * Maximum we may have 100% VAT rate
           * We have to provide VAT Rate in minors,
           *  because we're using Euros as a currency
           *  and Euros has two minors (100)
           */
          max: 100 * 100,
        }),
        country: getRandomProperty(AllowedCountries),
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

function createRandomInvoice(): InvoiceResponsePayload {
  const randomExistingCounterpart = getRandomItemFromArray(
    counterpartListFixture
  );
  const status = getRandomProperty(ReceivablesStatusEnum);
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

  return {
    type: InvoiceResponsePayload.type.INVOICE,
    id: faker.string.uuid(),
    amount_paid: faker.number.int(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    document_id: rid(`INV-${faker.string.nanoid(20)}`),
    issue_date: rid(faker.date.past().toString()),
    fulfillment_date: rid(faker.date.future().toString()),
    payment_terms: generatePaymentTerm(),
    currency: CurrencyEnum.EUR,
    line_items: new Array(getRandomNumber(1, 15))
      .fill('_')
      .map(createRandomLineItem),
    counterpart_id: faker.datatype.boolean(0.9)
      ? randomExistingCounterpart.id
      : /** For some cases, emulate a scenario when counterpart can't be fetched */
        faker.string.uuid(),
    counterpart_name:
      counterpartType === CounterpartType.ORGANIZATION
        ? faker.company.name()
        : undefined,
    counterpart_type: counterpartType,
    counterpart_tax_id: faker.datatype.boolean()
      ? faker.string.numeric(10)
      : undefined,
    counterpart_billing_address: faker.datatype.boolean()
      ? generateCounterpartAddress()
      : undefined,
    counterpart_shipping_address: faker.datatype.boolean()
      ? generateCounterpartAddress()
      : undefined,
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
    entity_vat_id: faker.datatype.boolean()
      ? {
          country: getRandomProperty(AllowedCountries),
          type: faker.datatype.boolean()
            ? getRandomProperty(VatIDTypeEnum)
            : undefined,
          value: faker.string.numeric(10),
          id: faker.string.nanoid(),
          entity_id: entityIds[0],
        }
      : undefined,
    entity_address: generateCounterpartAddress(),
    entity_bank_account: faker.datatype.boolean()
      ? {
          iban: faker.finance.iban(),
          bic: faker.finance.bic(),
          bank_name: faker.finance.accountName(),
          display_name: faker.finance.accountName(),
          is_default: true,
        }
      : undefined,
    related_documents: {
      credit_note_ids: undefined,
      proforma_invoice_id: undefined,
    },
    status,

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

export const receivableFixture = {
  type: 'quote',
  expiry_date: '2022-11-28',
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  created_at: '2022-11-28T15:11:14.841Z',
  updated_at: '2022-11-28T15:11:14.841Z',
  document_id: 'string',
  currency: CurrencyEnum.USD,
  total_amount: 0,
  line_items: [
    {
      quantity: 0,
      product: {
        name: 'string',
        type: ProductServiceTypeEnum.PRODUCT,
        description: 'string',
        price: {
          currency: CurrencyEnum.USD,
          value: 0,
        },
        measure_unit_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        smallest_amount: 0,
        ledger_account_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        entity_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        entity_user_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        created_at: '2022-11-28T15:11:14.841Z',
        updated_at: '2022-11-28T15:11:14.841Z',
        vat_rate: {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          created_at: '2022-11-28T15:11:14.841Z',
          updated_at: '2022-11-28T15:11:14.841Z',
          value: 10000,
          country: AllowedCountries.DE,
          valid_until: '2022-11-28',
          valid_from: '2022-11-28',
          status: 'active',
          created_by: 'monite',
        },
        measure_unit: {
          name: 'string',
          description: 'string',
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          created_at: '2022-11-28T15:11:14.841Z',
          updated_at: '2022-11-28T15:11:14.841Z',
        },
      },
      discount: {
        type: 'amount',
        amount: 0,
      },
    },
  ],
  entity_address: {
    country: AllowedCountries.DE,
    city: 'string',
    postal_code: 'string',
    state: 'string',
    line1: 'string',
    line2: 'string',
  },
  entity: createRandomEntity(),
  entity_user_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  counterpart_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  counterpart_type: 'individual',
  counterpart_address: {
    country: AllowedCountries.DE,
    city: 'Berlin',
    postal_code: '10115',
    state: 'string',
    line1: 'Flughafenstrasse 52',
    line2: 'string',
  },
  counterpart_contact: {
    first_name: 'Marge',
    last_name: 'Smith',
    email: 'marge@example.org',
    phone: '55512378654',
    title: 'Dr.',
    address: {
      country: AllowedCountries.DE,
      city: 'Berlin',
      postal_code: '10115',
      state: 'string',
      line1: 'Flughafenstrasse 52',
      line2: 'string',
    },
  },
  counterpart_name: 'Nathaniel',
  file_url: 'string',
  commercial_condition_description: 'string',
  total_vat_amount: 0,
  entity_bank_account: {
    iban: 'string',
    bic: 'string',
    bank_name: 'string',
    display_name: 'string',
    is_default: false,
  },
  vat_exempt: true,
  vat_exemption_rationale: 'string',
  based_on: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  based_on_document_id: 'string',
  memo: 'string',
  issue_date: '2022-11-28T15:11:14.841Z',
  counterpart_shipping_address: {
    country: AllowedCountries.DE,
    city: 'Berlin',
    postal_code: '10115',
    state: 'string',
    line1: 'Flughafenstrasse 52',
    line2: 'string',
  },
  counterpart_billing_address: {
    country: AllowedCountries.DE,
    city: 'Berlin',
    postal_code: '10115',
    state: 'string',
    line1: 'Flughafenstrasse 52',
    line2: 'string',
  },
  counterpart_business_type: 'string',
  discount: {
    type: 'amount',
    amount: 0,
  },
  comment: 'string',
  status: QuoteStateEnum.DRAFT,
} as ReceivableResponse;
