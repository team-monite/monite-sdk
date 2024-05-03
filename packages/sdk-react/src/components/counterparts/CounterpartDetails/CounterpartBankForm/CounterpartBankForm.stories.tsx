import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { counterpartBankListFixture } from '@/mocks';
import { individualId } from '@/mocks/counterparts/counterpart.mocks.types';
import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';

import { CounterpartBankForm } from './CounterpartBankForm';

const meta: Meta<typeof CounterpartBankForm> = {
  title: 'Counterparts/Counterparts — Bank Form',
  component: CounterpartBankForm,
};

type Story = StoryObj<typeof CounterpartBankForm>;

const CenteredWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ maxWidth: '800px', margin: '0 auto' }}>{children}</div>
);

export const CreateNewBankAccount: Story = {
  args: {
    counterpartId: individualId,
    onCreate: action('onCreate'),
  },
  render: (args) => (
    <MoniteScopedProviders>
      <CenteredWrapper>
        <CounterpartBankForm {...args} />
      </CenteredWrapper>
    </MoniteScopedProviders>
  ),
};

export const UpdateExistingBankAccount: Story = {
  args: {
    counterpartId: individualId,
    bankId: counterpartBankListFixture[0].id,
    onCreate: action('onCreate'),
  },
  render: (args) => (
    <MoniteScopedProviders>
      <CenteredWrapper>
        <CounterpartBankForm {...args} />
      </CenteredWrapper>
    </MoniteScopedProviders>
  ),
};

export default meta;
