import { Dialog } from '@/components/Dialog';
import { receivableListFixture } from '@/mocks/receivables/receivablesFixture';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceDetails } from './InvoiceDetails';

const meta: Meta<typeof InvoiceDetails> = {
  title: 'Receivables/Invoices — Details',
  component: InvoiceDetails,
};

type Story = StoryObj<typeof InvoiceDetails>;

const invoiceInDraftStatus = receivableListFixture.invoice.find(
  (invoice) => invoice.status === 'draft'
);
const invoiceIdInDraftStatus = invoiceInDraftStatus
  ? invoiceInDraftStatus.id
  : receivableListFixture.invoice[0].id;
const invoiceId = receivableListFixture.invoice[0].id;

const actions = {
  onCancel: action('onCancel'),
  onIssue: action('onIssue'),
  onDelete: action('onDelete'),
  onMarkAsUncollectible: action('onMarkAsUncollectible'),
};

export const DialogDetailsView: Story = {
  args: {
    id: invoiceId,
    ...actions,
  },
  render: (args) => (
    <Dialog open fullScreen {...args} onClose={action('onClose')}>
      <InvoiceDetails {...args} />
    </Dialog>
  ),
};

export const DialogCreateView: Story = {
  args: {
    type: 'invoice',
    onCreate: action('onCreate'),
    ...actions,
  },
  render: (args) => (
    <Dialog open={true} fullScreen {...args} onClose={action('onClose')}>
      <InvoiceDetails {...args} />
    </Dialog>
  ),
};

export const IvoiceDetails: Story = {
  args: {
    id: invoiceIdInDraftStatus,
    ...actions,
  },
  render: (args) => <InvoiceDetails {...args} />,
};

export const CreateInvoice: Story = {
  args: {
    type: 'invoice',
    onCreate: action('onCreate'),
    ...actions,
  },
  render: (args) => <InvoiceDetails {...args} />,
};

export const UndefinedOrError: Story = {
  args: {
    id: '3g2fe86b-f02a-343f-a258-a19e53bd06e1',
    ...actions,
  },
  render: (args) => <InvoiceDetails {...args} />,
};

export default meta;
