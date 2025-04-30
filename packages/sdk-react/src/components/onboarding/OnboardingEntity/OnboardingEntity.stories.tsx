import { FormProvider, useForm } from 'react-hook-form';

import {
  authenticationHandlers,
  entityUsersHandlers,
  onboardingHandlers,
} from '@/mocks';
import { Meta, StoryObj } from '@storybook/react';

import { OnboardingContextProvider } from '../context';
import { OnboardingEntity } from './OnboardingEntity';

const meta: Meta<typeof OnboardingEntity> = {
  title: 'Onboarding/Entity',
  component: OnboardingEntity,
  parameters: {
    msw: {
      handlers: [
        ...onboardingHandlers,
        ...authenticationHandlers,
        ...entityUsersHandlers,
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof OnboardingEntity>;

const OnboardingEntityWrapper = () => {
  const methods = useForm({
    defaultValues: {
      entity: {
        type: 'organization',
        organization: {
          legal_name: 'Monite GmbH',
        },
        email: 'contact@monite.com',
        phone: '+4912345678',
        address: {
          country: 'DE',
          city: 'Berlin',
          line1: 'Hauptstrasse 1',
          postal_code: '10115',
          state: 'Berlin',
        },
      },
    },
  });

  return (
    <OnboardingContextProvider>
      <FormProvider {...methods}>
        <OnboardingEntity />
      </FormProvider>
    </OnboardingContextProvider>
  );
};

export const Organization: Story = {
  render: () => <OnboardingEntityWrapper />,
};
