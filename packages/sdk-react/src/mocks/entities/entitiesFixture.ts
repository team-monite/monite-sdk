import { components } from '@/api';
import { AllowedCountries } from '@/enums/AllowedCountries';
import { VatIDTypeEnum } from '@/enums/VatIDTypeEnum';
import { getRandomItemFromArray } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';

export const entityIds = ['be035ef1-dd47-4f47-a6ad-eef2e7f2e608'] as const;

function getEntitySettings(): MergedSettingsResponse {
  return {
    allow_purchase_order_autolinking: false,
    payment_priority: 'balanced',
    receivable_edit_flow: 'non_compliant',
    generate_paid_invoice_pdf: false,
    quote_signature_required: false,
    vat_mode: 'exclusive',
    currency: {
      default: 'EUR',
      exchange_rates: [],
    },
  };
}

function generateEntityVatIdResourceList(
  entityId: string
): Array<EntityVatIDResponse> {
  return new Array(5).fill('_').map((_) => ({
    id: faker.string.uuid(),
    entity_id: entityId,
    value: faker.string.numeric(10),
    type: getRandomItemFromArray(VatIDTypeEnum),
    country: getRandomItemFromArray(AllowedCountries),
  }));
}

function generateEntityData(entityId: string): EntityResponse {
  const type = faker.datatype.boolean() ? 'individual' : 'organization';
  const address: components['schemas']['EntityAddressSchema'] = {
    country: 'DE',
    city: faker.location.city(),
    line1: faker.location.streetAddress(),
    postal_code: faker.location.zipCode(),
    state: faker.location.state(),
  };
  const taxId = faker.datatype.boolean(0.9)
    ? faker.string.numeric(10)
    : undefined;

  if (type === 'individual') {
    return {
      id: entityId,
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.past().toISOString(),
      address,
      email: faker.datatype.boolean() ? faker.internet.email() : undefined,
      phone: faker.datatype.boolean() ? faker.phone.number() : undefined,
      status: 'active',
      tax_id: taxId,
      type: 'individual',
      individual: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        title: faker.person.jobTitle(),
      },
    };
  }

  return {
    id: entityId,
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.past().toISOString(),
    address,
    email: faker.datatype.boolean() ? faker.internet.email() : undefined,
    phone: faker.datatype.boolean() ? faker.phone.number() : undefined,
    status: 'active',
    type: 'organization',
    tax_id: taxId,
    organization: {
      legal_name: faker.company.name(),
    },
  };
}

export const entitySettingsById: Record<string, MergedSettingsResponse> = {
  [entityIds[0]]: getEntitySettings(),
};

export const entityVatIdList: Record<string, EntityVatIDResourceList> =
  entityIds.reduce<Record<string, EntityVatIDResourceList>>((acc, entityId) => {
    acc[entityId] = {
      data: generateEntityVatIdResourceList(entityId),
    };

    return acc;
  }, {});

export const getCurrentEntity = (): EntityResponse =>
  generateEntityData(entityIds[0]);

export const entityPaymentMethods: OnboardingPaymentMethodsResponse = {
  data: [
    {
      direction: 'receive',
      name: 'Card payments',
      status: 'active',
      type: 'card',
    },
    {
      direction: 'receive',
      name: 'SEPA Payments',
      status: 'active',
      type: 'sepa_credit',
    },
    {
      direction: 'receive',
      name: 'SEPA Payments',
      status: 'inactive',
      type: 'sepa_debit',
    },
  ],
};

type EntityResponse = components['schemas']['EntityResponse'];
type EntityVatIDResourceList = components['schemas']['EntityVatIDResourceList'];
type EntityVatIDResponse = components['schemas']['EntityVatIDResponse'];
type MergedSettingsResponse = components['schemas']['SettingsResponse'];
type OnboardingPaymentMethodsResponse =
  components['schemas']['OnboardingPaymentMethodsResponse'];
