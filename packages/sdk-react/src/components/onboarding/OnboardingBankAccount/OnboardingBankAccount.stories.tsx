import { Onboarding as OnboardingComponent } from '../Onboarding';
import { OnboardingStepContent } from '../OnboardingLayout';
import { OnboardingContextProvider } from '../context';
import { OnboardingBankAccount } from './OnboardingBankAccount';
import { components } from '@/api';
import { onboardingHandlers } from '@/mocks/onboarding';
import { StoryObj, Meta } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

const meta: Meta<typeof OnboardingBankAccount> = {
  title: 'Onboarding/Bank Account',
  component: OnboardingBankAccount,
  parameters: {
    msw: {
      handlers: onboardingHandlers,
    },
  },
};

export default meta;
type Story = StoryObj<typeof OnboardingBankAccount>;

const StoryWrapper = () => {
  return (
    <OnboardingContextProvider>
      <OnboardingStepContent>
        <OnboardingBankAccount />
      </OnboardingStepContent>
    </OnboardingContextProvider>
  );
};

export const BankAccount: Story = {
  render: () => <StoryWrapper />,
};

const editingBankAccountFixture: components['schemas']['OnboardingBankAccount'] =
  {
    id: 'existing-account-id',
    country: { value: 'DE', required: true, error: null },
    currency: { value: 'EUR', required: true, error: null },
    account_holder_name: {
      value: 'Existing User GmbH',
      required: true,
      error: null,
    },
    iban: { value: 'DE89370400440532013000', required: true, error: null },
  };

export const WithAllowedCountriesAndCurrencies: Story = {
  render: (args) => <OnboardingComponent {...args} />,
  args: {
    allowedCountries: ['US', 'DE'],
    allowedCurrencies: ['USD', 'EUR'],
  },
};

export const Editing: Story = {
  render: () => <OnboardingComponent />,
  parameters: {
    msw: {
      handlers: [
        http.get('*/frontend/onboarding_requirements', () => {
          return HttpResponse.json({
            requirements: ['bank_accounts'],
            data: {
              bank_accounts: [editingBankAccountFixture],
              entity: { data: {}, fields: {} },
              persons: [],
              business_profile: { data: {}, fields: {} },
            },
          } as components['schemas']['InternalOnboardingRequirementsResponse']);
        }),
      ],
    },
  },
};
