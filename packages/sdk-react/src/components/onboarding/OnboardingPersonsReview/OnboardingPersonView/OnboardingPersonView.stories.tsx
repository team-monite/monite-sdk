import { components } from '@/api';
import { StoryObj } from '@storybook/react';

import { OnboardingContextProvider } from '../../context';
import { OnboardingStepContent } from '../../OnboardingLayout';
import { OnboardingPersonView } from './OnboardingPersonView';

type OnboardingPerson = components['schemas']['OnboardingPerson'];

const defaultPerson: OnboardingPerson = {
  id: 'person-1',
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
  email: {
    value: 'john.doe@example.com',
    error: null,
    required: true,
  },
  id_number: {
    value: '123-45-6789',
    error: null,
    required: true,
  },
  ssn_last_4: {
    value: '6789',
    error: null,
    required: false,
  },
  date_of_birth: {
    value: '1990-01-01',
    error: null,
    required: true,
  },
  phone: {
    value: '+1234567890',
    error: null,
    required: true,
  },
  relationship: {
    owner: true,
    director: false,
    executive: false,
    representative: false,
    title: {
      value: 'Owner',
      error: null,
      required: true,
    },
    percent_ownership: {
      value: 100,
      error: null,
      required: true,
    },
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

const StoryWrapper = (
  args: React.ComponentProps<typeof OnboardingPersonView>
) => {
  return (
    <OnboardingContextProvider>
      <OnboardingStepContent>
        <OnboardingPersonView {...args} />
      </OnboardingStepContent>
    </OnboardingContextProvider>
  );
};

const Story = {
  title: 'Onboarding/PersonView',
  component: OnboardingPersonView,
};

type Story = StoryObj<typeof OnboardingPersonView>;

export const Complete: Story = {
  args: defaultPerson,
  render: (args) => <StoryWrapper {...args} />,
};

export const WithoutOptionalFields: Story = {
  args: {
    ...defaultPerson,
    ssn_last_4: {
      value: '',
      error: null,
      required: false,
    },
    address: {
      ...defaultPerson.address,
      line2: {
        value: '',
        error: null,
        required: false,
      },
    },
  },
  render: (args) => <StoryWrapper {...args} />,
};

export const WithErrors: Story = {
  args: {
    ...defaultPerson,
    first_name: {
      value: '',
      error: { message: 'First name is required' },
      required: true,
    },
    email: {
      value: '',
      error: { message: 'Email is required' },
      required: true,
    },
    address: {
      ...defaultPerson.address,
      postal_code: {
        value: '',
        error: { message: 'Postal code is required' },
        required: true,
      },
    },
    emptyFields: ['first_name', 'email', 'address.postal_code'],
  },
  render: (args) => <StoryWrapper {...args} />,
};

export const WithMultipleRoles: Story = {
  args: {
    ...defaultPerson,
    relationship: {
      ...defaultPerson.relationship,
      owner: true,
      director: true,
      executive: true,
    },
  },
  render: (args) => <StoryWrapper {...args} />,
};

export default Story;
