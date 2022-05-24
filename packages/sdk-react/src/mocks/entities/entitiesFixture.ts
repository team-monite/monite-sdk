import { getRandomProperty } from '@/utils/storybook-utils';
import { faker } from '@faker-js/faker';
import {
  AllowedCountries,
  CurrencyEnum,
  EntityIndividualResponse,
  EntityOrganizationResponse,
  EntityResponse,
  EntityVatIDResourceList,
  EntityVatIDResponse,
  MergedSettingsResponse,
  StatusEnum,
  VatIDTypeEnum,
} from '@monite/sdk-api';

export const entityIds = ['be035ef1-dd47-4f47-a6ad-eef2e7f2e608'] as const;

function getEntitySettings(): MergedSettingsResponse {
  return {
    currency: faker.datatype.boolean()
      ? {
          default: getRandomProperty({
            EUR: CurrencyEnum.EUR,
            USD: CurrencyEnum.USD,
            GEL: CurrencyEnum.GEL,
            KZT: CurrencyEnum.KZT,
          }),
          exchange_rates: [],
        }
      : undefined,
  };
}

function generateEntityVatIdResourceList(
  entityId: string
): Array<EntityVatIDResponse> {
  return new Array(5).fill('_').map((_) => ({
    id: faker.string.uuid(),
    entity_id: entityId,
    value: faker.string.numeric(10),
    type: getRandomProperty(VatIDTypeEnum),
    country: getRandomProperty(AllowedCountries),
  }));
}

function generateEntityData(entityId: string): EntityResponse {
  const type = faker.datatype.boolean() ? 'individual' : 'organization';
  const address = {
    country: getRandomProperty({
      DE: AllowedCountries.DE,
      US: AllowedCountries.US,
      KZ: AllowedCountries.KZ,
    }),
    city: faker.location.city(),
    line1: faker.location.streetAddress(),
    postal_code: faker.location.zipCode(),
    state: faker.location.state(),
  };
  const taxId = faker.datatype.boolean(0.9)
    ? faker.string.numeric(10)
    : undefined;

  if (type === 'individual') {
    const individual: EntityIndividualResponse = {
      id: entityId,
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.past().toISOString(),
      address,
      email: faker.datatype.boolean() ? faker.internet.email() : undefined,
      phone: faker.datatype.boolean() ? faker.phone.number() : undefined,
      status: StatusEnum.ACTIVE,
      tax_id: taxId,
      type: 'individual',
      individual: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        title: faker.person.jobTitle(),
      },
    };

    return individual;
  }

  const organization: EntityOrganizationResponse = {
    id: entityId,
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.past().toISOString(),
    address,
    email: faker.datatype.boolean() ? faker.internet.email() : undefined,
    phone: faker.datatype.boolean() ? faker.phone.number() : undefined,
    status: StatusEnum.ACTIVE,
    type: 'organization',
    tax_id: taxId,
    organization: {
      legal_name: faker.company.name(),
    },
  };

  return organization;
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
