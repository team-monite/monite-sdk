import { receivableListFixture } from '@/mocks/receivables/receivablesFixture';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceDetails } from './InvoiceDetails';

const meta: Meta<typeof InvoiceDetails> = {
  title: 'Receivables/InvoiceDetails',
  component: InvoiceDetails,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onClose: { action: 'onClose' },
    onDuplicate: { action: 'onDuplicate' },
    onMarkAsUncollectible: { action: 'onMarkAsUncollectible' },
  },
};

type Story = StoryObj<typeof InvoiceDetails>;

const invoiceInDraftStatus = receivableListFixture.invoice.find(
  (invoice) => invoice.status === 'draft'
);
const invoiceInIssuedStatus = receivableListFixture.invoice.find(
  (invoice) => invoice.status === 'issued'
);
const invoiceInPaidStatus = receivableListFixture.invoice.find(
  (invoice) => invoice.status === 'paid'
);
const invoiceInOverdueStatus = receivableListFixture.invoice.find(
  (invoice) => invoice.status === 'overdue'
);

const defaultInvoiceId = receivableListFixture.invoice[0].id;
const draftInvoiceId = invoiceInDraftStatus?.id || defaultInvoiceId;
const issuedInvoiceId = invoiceInIssuedStatus?.id || defaultInvoiceId;
const paidInvoiceId = invoiceInPaidStatus?.id || defaultInvoiceId;
const overdueInvoiceId = invoiceInOverdueStatus?.id || defaultInvoiceId;

export default meta;

export const Default: Story = {
  args: {
    open: true,
    invoiceId: defaultInvoiceId,
  },
};

export const DraftInvoice: Story = {
  args: {
    open: true,
    invoiceId: draftInvoiceId,
  },
};

export const IssuedInvoice: Story = {
  args: {
    open: true,
    invoiceId: issuedInvoiceId,
  },
};

export const PaidInvoice: Story = {
  args: {
    open: true,
    invoiceId: paidInvoiceId,
  },
};

export const OverdueInvoice: Story = {
  args: {
    open: true,
    invoiceId: overdueInvoiceId,
  },
};

export const InvoiceNotFound: Story = {
  args: {
    open: true,
    invoiceId: 'non-existent-invoice-id',
  },
};

export const WithAllCallbacks: Story = {
  args: {
    open: true,
    invoiceId: defaultInvoiceId,
    onClose: action('onClose'),
    onDuplicate: action('onDuplicate'),
    onMarkAsUncollectible: action('onMarkAsUncollectible'),
  },
};
