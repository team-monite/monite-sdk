import { individualId } from '@/mocks/counterparts/counterpart.mocks.types';
import { receivableListFixture } from '@/mocks/receivables/receivablesFixture';
import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';

import { CounterpartDetails } from '../counterparts/CounterpartDetails';
import { InvoiceDetails } from '../receivables/InvoiceDetails';
import { Dialog } from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  argTypes: {
    alignDialog: {
      control: {
        type: 'inline-radio',
      },
      options: ['left', 'right', 'none'],
      mapping: {
        left: 'left',
        right: 'right',
        none: '',
      },
    },
    fullScreen: {
      control: {
        type: 'boolean',
      },
    },
  },
};

type Story = StoryObj<typeof Dialog>;

const actions = {
  onClose: action('onClose'),
};

export const CounterpartFormIndividual: Story = {
  args: {
    open: true,
    fullScreen: false,
    ...actions,
  },
  render: (args) => (
    <Dialog {...args}>
      <CounterpartDetails type="individual" {...actions} />
    </Dialog>
  ),
};

export const CounterpartDetailsIndividual: Story = {
  args: {
    open: true,
    alignDialog: 'right',
    ...actions,
  },
  render: (args) => (
    <Dialog {...args}>
      <CounterpartDetails
        id={individualId}
        showBankAccounts={true}
        {...actions}
      />
    </Dialog>
  ),
};

export const IvoiceDetails: Story = {
  args: {
    open: true,
    alignDialog: 'left',
    ...actions,
  },
  render: (args) => (
    <Dialog {...args}>
      <InvoiceDetails
        id={receivableListFixture.invoice[0].id}
        onCancel={action('onCancel')}
        onIssue={action('onIssue')}
        onDelete={action('onDelete')}
        onMarkAsUncollectible={action('onMarkAsUncollectible')}
        {...actions}
      />
    </Dialog>
  ),
};

export default meta;
