import { CounterpartDetails } from './CounterpartDetails';
import {
  individualId,
  organizationId,
} from '@/mocks/counterparts/counterpart.mocks.types';
import { Dialog } from '@/ui/Dialog';
import { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

const meta: Meta<typeof CounterpartDetails> = {
  title: 'Counterparts/Counterparts — Details View',
  component: CounterpartDetails,
};

type Story = StoryObj<typeof CounterpartDetails>;

const actions = {
  onCreate: action('onCreate'),
  onUpdate: action('onUpdate'),
  onDelete: action('onDelete'),
  onContactCreate: action('onContactCreate'),
  onContactUpdate: action('onContactUpdate'),
  onContactDelete: action('onContactDelete'),
  onBankCreate: action('onBankCreate'),
  onBankUpdate: action('onBankUpdate'),
  onBankDelete: action('onBankDelete'),
};

const CenteredWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ maxWidth: '800px', margin: '0 auto' }}>{children}</div>
);

export const DialogUpdateExistingIndividual: Story = {
  args: {
    id: individualId,
    ...actions,
  },
  render: (args) => (
    <Dialog open alignDialog="right" {...args}>
      <CounterpartDetails {...args} />
    </Dialog>
  ),
};

export const DialogCreateNewIndividual: Story = {
  args: {
    type: 'individual',
    ...actions,
  },
  render: (args) => (
    <Dialog open alignDialog="right" {...args} onClose={action('onClose')}>
      <CounterpartDetails {...args} />
    </Dialog>
  ),
};

export const UpdateExistingIndividual: Story = {
  args: {
    id: individualId,
    showBankAccounts: true,
    ...actions,
  },
  render: (args) => (
    <CenteredWrapper>
      <CounterpartDetails {...args} />
    </CenteredWrapper>
  ),
};

export const UpdateExistingOrganization: Story = {
  args: {
    id: organizationId,
    showBankAccounts: true,
    ...actions,
  },
  render: (args) => (
    <CenteredWrapper>
      <CounterpartDetails {...args} />
    </CenteredWrapper>
  ),
};

export const CreateNewIndividual: Story = {
  args: {
    type: 'individual',
    ...actions,
  },
  render: (args) => (
    <CenteredWrapper>
      <CounterpartDetails {...args} />
    </CenteredWrapper>
  ),
};

export const CreateNewOrganization: Story = {
  args: {
    type: 'organization',
    ...actions,
  },
  render: (args) => (
    <CenteredWrapper>
      <CounterpartDetails {...args} />
    </CenteredWrapper>
  ),
};

export default meta;
