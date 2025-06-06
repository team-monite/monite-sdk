import { ReactNode } from 'react';
import { FormProvider } from 'react-hook-form';

import { components } from '@/api';
import { messages as enLocaleMessages } from '@/core/i18n/locales/en/messages';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import type { Meta, StoryObj } from '@storybook/react';

import { http, HttpResponse } from 'msw';

import { OnboardingContextProvider } from '../../context';
import { useOnboardingForm } from '../../hooks/useOnboardingForm';
import { OnboardingAddress } from '../../OnboardingAddress';
import { OnboardingFormActionsTemplate } from '../../OnboardingFormActions';
import { OnboardingForm, OnboardingStepContent } from '../../OnboardingLayout';
import { OnboardingEntityIndividual } from './OnboardingEntityIndividual';

type StoryWrapperProps = {
  children: ReactNode;
  individualDefaultValues: IndividualData;
  addressDefaultValues: AddressData;
  isLoading: boolean;
};

const emptyFieldsUS = {
  first_name: {
    value: '',
    error: null,
    required: true,
  },
  last_name: {
    value: '',
    error: null,
    required: true,
  },
  title: {
    value: '',
    error: null,
    required: true,
  },
  date_of_birth: {
    value: '',
    error: null,
    required: true,
  },
  id_number: {
    value: '',
    error: null,
    required: true,
  },
  address: {
    country: {
      value: 'US',
      error: null,
      required: true,
    },
    line1: {
      value: '',
      error: null,
      required: true,
    },
    line2: {
      value: '',
      error: null,
      required: false,
    },
    city: {
      value: '',
      error: null,
      required: true,
    },
    state: {
      value: '',
      error: null,
      required: true,
    },
    postal_code: {
      value: '',
      error: null,
      required: true,
    },
  },
};

const existingFieldsUS = {
  first_name: {
    value: 'John',
    error: null,
    required: true,
  },
  last_name: {
    value: 'Doe',
    error: null,
    required: true,
  },
  title: {
    value: 'CEO',
    error: null,
    required: true,
  },
  date_of_birth: {
    value: '1990-01-01',
    error: null,
    required: true,
  },
  id_number: {
    value: '123-45-6789',
    error: null,
    required: true,
  },
  address: {
    country: {
      value: 'US',
      error: null,
      required: true,
    },
    line1: {
      value: '123 Main St',
      error: null,
      required: true,
    },
    line2: {
      value: 'Apt 4B',
      error: null,
      required: false,
    },
    city: {
      value: 'New York',
      error: null,
      required: true,
    },
    state: {
      value: 'NY',
      error: null,
      required: true,
    },
    postal_code: {
      value: '10001',
      error: null,
      required: true,
    },
  },
};

const emptyFieldsGB = {
  ...emptyFieldsUS,
  address: {
    ...emptyFieldsUS.address,
    country: {
      value: 'GB',
      error: null,
      required: true,
    },
  },
};

const existingFieldsGB = {
  ...existingFieldsUS,
  address: {
    ...existingFieldsUS.address,
    country: {
      value: 'GB',
      error: null,
      required: true,
    },
  },
};

const baseMswHandlers = [
  http.post('*/auth/token', () => {
    return HttpResponse.json({
      access_token: 'test_token',
      token_type: 'bearer',
      expires_in: 3600,
    });
  }),
  http.get('*/entity_users/my_entity', () => {
    return HttpResponse.json({
      id: '8ee9e41c-cb3c-4f85-84c8-58aa54b09f44',
      created_at: '2024-03-19T18:58:31.123Z',
      updated_at: '2024-03-19T18:58:31.123Z',
      entity_id: 'be035ef1-dd47-4f47-a6ad-eef2e7f2e608',
      role: 'owner',
      status: 'active',
      login: 'test@example.com',
    });
  }),
  http.get('*/entities/*/settings', () => {
    return HttpResponse.json({
      id: 'be035ef1-dd47-4f47-a6ad-eef2e7f2e608',
      created_at: '2024-03-19T18:58:31.123Z',
      updated_at: '2024-03-19T18:58:31.123Z',
      currency: 'USD',
      timezone: 'America/New_York',
      country: 'US',
    });
  }),
  http.get('*/frontend/individual_mask', ({ request }) => {
    const url = new URL(request.url);
    const country = url.searchParams.get('country');
    const response = {
      first_name: true,
      last_name: true,
      title: true,
      date_of_birth: true,
      ...(country === 'US' && {
        id_number: true,
      }),
      address: {
        country: true,
        line1: true,
        line2: true,
        city: true,
        state: true,
        postal_code: true,
      },
    };
    return HttpResponse.json(response);
  }),
];

const getDefaultsFromFields = (
  fields:
    | typeof emptyFieldsUS
    | typeof existingFieldsUS
    | typeof emptyFieldsGB
    | typeof existingFieldsGB
) => ({
  individualDefaultValues: {
    first_name: fields.first_name.value,
    last_name: fields.last_name.value,
    title: fields.title.value,
    date_of_birth: fields.date_of_birth.value,
    id_number: fields.id_number.value,
  },
  addressDefaultValues: {
    country: fields.address.country.value as AddressData['country'],
    line1: fields.address.line1.value,
    line2: fields.address.line2.value,
    city: fields.address.city.value,
    state: fields.address.state.value,
    postal_code: fields.address.postal_code.value,
  },
});

const i18n = setupI18n({
  locale: 'en',
  messages: {
    en: enLocaleMessages,
  },
});

const FormContent = ({
  individualDefaultValues,
  addressDefaultValues,
  isLoading,
}: StoryWrapperProps) => {
  const individualFields = {
    individual: {
      first_name: {
        value: individualDefaultValues.first_name,
        error: null,
        required: true,
      },
      last_name: {
        value: individualDefaultValues.last_name,
        error: null,
        required: true,
      },
      title: {
        value: individualDefaultValues.title,
        error: null,
        required: true,
      },
      date_of_birth: {
        value: individualDefaultValues.date_of_birth,
        error: null,
        required: true,
      },
      id_number: {
        value: individualDefaultValues.id_number,
        error: null,
        required: true,
      },
    },
    address: {
      country: {
        value: addressDefaultValues.country,
        error: null,
        required: true,
      },
      line1: { value: addressDefaultValues.line1, error: null, required: true },
      line2: {
        value: addressDefaultValues.line2,
        error: null,
        required: false,
      },
      city: { value: addressDefaultValues.city, error: null, required: true },
      state: {
        value: addressDefaultValues.state,
        error: null,
        required: addressDefaultValues.country === 'US',
      },
      postal_code: {
        value: addressDefaultValues.postal_code,
        error: null,
        required: true,
      },
    },
  };

  const { defaultValues, methods } = useOnboardingForm(
    individualFields,
    'entityIndividual',
    addressDefaultValues.country as components['schemas']['AllowedCountries']
  );

  const individualData = defaultValues?.individual || individualDefaultValues;
  const addressData = defaultValues?.address || addressDefaultValues;

  return (
    <FormProvider {...methods}>
      <OnboardingForm
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <OnboardingStepContent>
          <OnboardingEntityIndividual
            defaultValues={individualData}
            isLoading={isLoading}
          />
          <OnboardingAddress
            title="Address"
            defaultValues={addressData}
            isLoading={isLoading}
          />
        </OnboardingStepContent>
        <OnboardingFormActionsTemplate
          primaryLabel="Submit"
          isLoading={isLoading}
        />
      </OnboardingForm>
    </FormProvider>
  );
};

const StoryWrapper = (props: StoryWrapperProps) => {
  return (
    <I18nProvider i18n={i18n}>
      <OnboardingContextProvider>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '2rem',
            backgroundColor: '#f5f5f5',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <FormContent {...props} />
          </div>
        </div>
      </OnboardingContextProvider>
    </I18nProvider>
  );
};

const meta: Meta<StoryWrapperProps> = {
  title: 'Onboarding/OnboardingEntityIndividual',
  component: StoryWrapper,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<StoryWrapperProps>;

export const US_Empty: Story = {
  args: {
    ...getDefaultsFromFields(emptyFieldsUS),
    isLoading: false,
  },
  parameters: {
    msw: {
      handlers: [
        ...baseMswHandlers,
        http.get('*/frontend/onboarding_requirements', () => {
          const response = {
            requirements: ['individual'],
            data: {
              current_requirement: 'individual',
              is_edit_mode: true,
              individual_fields: emptyFieldsUS,
            },
          };
          return HttpResponse.json(response);
        }),
      ],
    },
  },
  render: StoryWrapper,
};

export const US_Filled: Story = {
  args: {
    ...getDefaultsFromFields(existingFieldsUS),
    isLoading: false,
  },
  parameters: {
    msw: {
      handlers: [
        ...baseMswHandlers,
        http.get('*/frontend/onboarding_requirements', () => {
          const response = {
            requirements: ['individual'],
            data: {
              current_requirement: 'individual',
              is_edit_mode: true,
              individual_fields: existingFieldsUS,
            },
          };
          return HttpResponse.json(response);
        }),
      ],
    },
  },
  render: StoryWrapper,
};

export const US_Loading: Story = {
  args: {
    ...getDefaultsFromFields(emptyFieldsUS),
    isLoading: true,
  },
  parameters: {
    msw: {
      handlers: baseMswHandlers,
    },
  },
  render: StoryWrapper,
};

export const GB_Empty: Story = {
  args: {
    ...getDefaultsFromFields(emptyFieldsGB),
    isLoading: false,
  },
  parameters: {
    msw: {
      handlers: [
        ...baseMswHandlers,
        http.get('*/frontend/onboarding_requirements', () => {
          const response = {
            requirements: ['individual'],
            data: {
              current_requirement: 'individual',
              is_edit_mode: true,
              individual_fields: emptyFieldsGB,
            },
          };
          return HttpResponse.json(response);
        }),
      ],
    },
  },
  render: StoryWrapper,
};

export const GB_Filled: Story = {
  args: {
    ...getDefaultsFromFields(existingFieldsGB),
    isLoading: false,
  },
  parameters: {
    msw: {
      handlers: [
        ...baseMswHandlers,
        http.get('*/frontend/onboarding_requirements', () => {
          const response = {
            requirements: ['individual'],
            data: {
              current_requirement: 'individual',
              is_edit_mode: true,
              individual_fields: existingFieldsGB,
            },
          };
          return HttpResponse.json(response);
        }),
      ],
    },
  },
  render: StoryWrapper,
};

export const GB_Loading: Story = {
  args: {
    ...getDefaultsFromFields(emptyFieldsGB),
    isLoading: true,
  },
  parameters: {
    msw: {
      handlers: baseMswHandlers,
    },
  },
  render: StoryWrapper,
};

type IndividualData = components['schemas']['OptionalIndividualSchema'];
type AddressData = components['schemas']['EntityAddressSchema'];
