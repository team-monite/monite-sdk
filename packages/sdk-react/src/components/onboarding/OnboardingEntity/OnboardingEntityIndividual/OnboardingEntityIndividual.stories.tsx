import { FormProvider, useForm } from 'react-hook-form';

import { components } from '@/api';
import { StoryObj } from '@storybook/react';

import { http, HttpResponse } from 'msw';

import { OnboardingContextProvider } from '../../context';
import { OnboardingAddress } from '../../OnboardingAddress';
import { OnboardingFormActions } from '../../OnboardingFormActions';
import { OnboardingForm, OnboardingStepContent } from '../../OnboardingLayout';
import { OnboardingEntityIndividual } from './OnboardingEntityIndividual';

type StoryWrapperProps = {
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

const Story = {
  title: 'Onboarding/Entity/Individual',
  component: OnboardingEntityIndividual,
  parameters: {
    msw: {
      handlers: [],
    },
  },
};

type Story = StoryObj<StoryWrapperProps>;
const getDefaultsFromFields = (fields: typeof emptyFieldsUS) => ({
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

const StoryWrapper = ({
  individualDefaultValues,
  addressDefaultValues,
  isLoading,
}: StoryWrapperProps) => {
  const methods = useForm({
    defaultValues: {
      individual: individualDefaultValues,
      address: addressDefaultValues,
    },
  });

  return (
    <OnboardingContextProvider>
      <FormProvider {...methods}>
        <OnboardingForm>
          <OnboardingStepContent>
            <OnboardingEntityIndividual
              defaultValues={individualDefaultValues}
              isLoading={isLoading}
            />
            <OnboardingAddress
              title="Address"
              defaultValues={addressDefaultValues}
              isLoading={isLoading}
            />
            <OnboardingFormActions isLoading={isLoading} />
          </OnboardingStepContent>
        </OnboardingForm>
      </FormProvider>
    </OnboardingContextProvider>
  );
};

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

export default Story;

type IndividualData = components['schemas']['OptionalIndividualSchema'];
type AddressData = components['schemas']['EntityAddressSchema'];
