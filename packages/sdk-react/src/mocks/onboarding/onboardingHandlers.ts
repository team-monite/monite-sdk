import {
  enrichFieldsByValues,
  generateOptionalFields,
  generateFieldsByMask,
} from '@/components/onboarding/transformers';
import { personMask } from '@/components/onboarding/transformers/tests/person';
import { onboardingBankAccountFixture } from '@/mocks/onboarding/onboardingBankAccountFixtures';
import { delay } from '@/mocks/utils';
import { faker } from '@faker-js/faker';
import {
  ErrorSchemaResponse,
  InternalOnboardingRequirementsResponse,
  OnboardingPerson,
  OnboardingPersonMask,
  OnboardingRequirement,
  Relationship,
  AllowedCountries,
  CurrencyEnum,
  OnboardingBankAccountMaskResponse,
  OnboardingAddress,
  PersonRequest,
} from '@monite/sdk-api';

import { rest } from 'msw';

import { personFixture } from '../persons/personsFixtures';
import { onboardingBusinessProfileFixture } from './onboardingBusinessProfile';
import { onboardingEntityFixture } from './onboardingEntityFixtures';

const onboardingPath = `*/frontend/onboarding_requirements`;

const onboardingPersonMaskPath = `*/frontend/person_mask`;

const onboardingBankAccountMaskPath = `*/frontend/bank_account_masks`;

const onboardingCurrencyToCountriesPath = `*/frontend/bank_accounts_currency_to_supported_countries`;

const generatedPersonFields =
  generateFieldsByMask<OnboardingPerson>(personMask);

export const mapPersonToOnboarding = (
  personValues: Partial<PersonRequest> = {}
): OnboardingPerson => {
  const person = personFixture(personValues);

  return {
    ...enrichFieldsByValues(generatedPersonFields, person),
    id: person.id,
  };
};

const getNewRepresentativePerson = () => {
  const person = personFixture({
    first_name: 'Representative',
    last_name: 'Person',
    relationship: {
      representative: true,
      executive: true,
    },
  });

  return {
    ...enrichFieldsByValues(generatedPersonFields, person),
    id: person.id,
  } as OnboardingPerson;
};

const getNewPersonWithErrors = () => {
  const person = personFixture({
    first_name: 'WithErrorsPerson',
    relationship: {
      director: true,
    },
  });

  const fields = enrichFieldsByValues(generatedPersonFields, person);

  const fieldsWithErrors = generateOptionalFields({
    fields,
    errors: [
      {
        code: 'address.line1',
        message: 'Incorrect address',
      },
    ],
  });

  return {
    ...fieldsWithErrors,
    id: person.id,
  } as OnboardingPerson;
};

const getNewPersonWithRequiredFields = () => {
  const person = personFixture({
    first_name: 'WithRequiredFieldsPerson',
    relationship: {
      director: true,
    },
  });

  const fields = enrichFieldsByValues(generatedPersonFields, person);

  const requiredFields = {
    ...fields,
    address: {
      ...(fields?.address as OnboardingAddress),
      line1: {
        required: true,
        value: null,
        error: null,
      },
      postal_code: {
        required: true,
        value: null,
        error: null,
      },
    },
  };

  return {
    ...requiredFields,
    id: person.id,
  } as OnboardingPerson;
};

export const personsList: OnboardingPerson[] = [
  getNewRepresentativePerson(),
  mapPersonToOnboarding(),
  mapPersonToOnboarding(),
  getNewPersonWithErrors(),
  getNewPersonWithErrors(),
  getNewPersonWithRequiredFields(),
];

const entity = onboardingEntityFixture('organization', {
  exclude: ['address.line1'],
  optional: ['address.line2'],
  errors: [
    {
      code: 'email',
      message: 'Incorrect email',
    },
    {
      code: 'address.postal_code',
      message: 'Incorrect postal code',
    },
  ],
});

export const onboardingHandlers = [
  rest.get<
    undefined,
    InternalOnboardingRequirementsResponse | ErrorSchemaResponse
  >(onboardingPath, (_, res, ctx) => {
    return res(
      delay(),
      ctx.status(200),
      ctx.json({
        requirements: [
          // OnboardingRequirement.ENTITY,
          // OnboardingRequirement.BUSINESS_PROFILE,
          // OnboardingRequirement.REPRESENTATIVE,
          // OnboardingRequirement.OWNERS,
          // OnboardingRequirement.DIRECTORS,
          // OnboardingRequirement.EXECUTIVES,
          // OnboardingRequirement.PERSONS,
          // OnboardingRequirement.PERSONS_DOCUMENTS,
          // OnboardingRequirement.ENTITY_DOCUMENTS,
          OnboardingRequirement.BANK_ACCOUNTS,
          OnboardingRequirement.OWNERSHIP_DECLARATION,
          OnboardingRequirement.TOS_ACCEPTANCE,
        ],
        data: {
          entity,
          persons_documents: personsList.map(
            ({ id }, index) =>
              index === 0 && {
                id,
                verification_document_front: {
                  value: null,
                  error: {
                    message: 'Error message',
                  },
                  required: true,
                },
              }
          ),
          entity_documents: {
            verification_document_front: {
              value: null,
              error: null,
              required: true,
            },
            verification_document_back: {
              value: faker.string.uuid(),
              error: {
                message: 'Error message',
              },
              required: true,
            },
          },
          persons: personsList,
          bank_accounts: [onboardingBankAccountFixture()],
          business_profile: onboardingBusinessProfileFixture(),
        },
      } as InternalOnboardingRequirementsResponse)
    );
  }),

  rest.get<
    { relationships: Array<Relationship>; country?: AllowedCountries },
    {},
    OnboardingPersonMask | ErrorSchemaResponse
  >(onboardingPersonMaskPath, async (req, res, ctx) => {
    const relationships = (req.url.searchParams.get('relationships') ??
      []) as Array<Relationship>;

    const country = req.url.searchParams.get(
      'country'
    ) as AllowedCountries | null;

    const filter = {
      relationships,
      country,
    };

    const relationshipLength = filter.relationships.length;

    const isRepresentative = filter.relationships.includes(
      Relationship.REPRESENTATIVE
    );

    const isDirector =
      filter.relationships.includes(Relationship.DIRECTOR) &&
      relationshipLength === 1;

    const isOwner = filter.relationships.includes(Relationship.OWNER);

    return res(
      delay(),
      ctx.status(200),
      ctx.json({
        first_name: true,
        last_name: true,
        email: true,

        phone: true,

        ...(!isDirector && { date_of_birth: true }),

        ...(filter.country === 'GB' && { id_number: true }),
        ...(filter.country === 'US' && { ssn_last_4: true }),

        ...(!isDirector && {
          address: {
            country: true,

            ...(!!filter.country && {
              city: true,
              line1: true,
              line2: false,
              postal_code: true,
              ...((filter.country === 'US' || filter.country === 'IE') && {
                state: true,
              }),
            }),
          },
        }),

        relationship: {
          ...(isRepresentative && { title: true }),
          ...(isOwner && { percent_ownership: true }),

          representative: true,
          owner: true,
          director: true,
          executive: true,
        },
      })
    );
  }),

  rest.get<
    undefined,
    {},
    OnboardingBankAccountMaskResponse | ErrorSchemaResponse
  >(onboardingBankAccountMaskPath, async (_, res, ctx) => {
    return res(
      delay(),
      ctx.status(200),
      ctx.json({
        [CurrencyEnum.EUR]: {
          country: true,
          currency: true,
          iban: true,
          account_holder_name: false,
        },
        [CurrencyEnum.GBP]: {
          country: true,
          currency: true,
          account_holder_name: true,
          account_number: true,
          sort_code: true,
        },
        [CurrencyEnum.USD]: {
          country: true,
          currency: true,
          account_holder_name: true,
          account_number: true,
          routing_number: true,
        },
      })
    );
  }),

  rest.get<undefined, {}>(onboardingCurrencyToCountriesPath, (_, res, ctx) => {
    return res(
      delay(),
      ctx.status(200),
      ctx.json({
        EUR: [
          'AT',
          'BE',
          'BG',
          'CH',
          'CY',
          'CZ',
          'DE',
          'DK',
          'EE',
          'ES',
          'FI',
          'FR',
          'GB',
          'GI',
          'GR',
          'HR',
          'HU',
          'IE',
          'IT',
          'LI',
          'LT',
          'LU',
          'LV',
          'MT',
          'NL',
          'NO',
          'PL',
          'PT',
          'RO',
          'SE',
          'SI',
          'SK',
        ],
        GBP: ['GB', 'GI'],
        USD: ['US'],
      })
    );
  }),
];
