import { ReceivablesTable } from './ReceivablesTable';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

const meta: Meta<typeof ReceivablesTable> = {
  title: 'Receivables/Receivables — Table View',
  component: ReceivablesTable,
};

type Story = StoryObj<typeof ReceivablesTable>;

export const FullPermissions: Story = {
  args: {
    onRowClick: action('onRowClick'),
  },
  render: (args) => (
    <div style={{ padding: 20 }}>
      <ReceivablesTable {...args} onTabChange={undefined} tab={undefined} />
    </div>
  ),
};

export const WithCustomTabs: Story = {
  args: {
    onRowClick: action('onRowClick'),
  },
  decorators: withGlobalStorybookDecorator(() => ({
    componentSettings: {
      receivables: {
        tab: 1,
        tabs: [
          {
            label: 'Draft Invoices',
            query: {
              type: 'invoice',
              sort: 'created_at',
              order: 'desc',
              status__in: ['draft'],
            },
            filters: [
              'document_id__contains',
              'counterpart_id',
              'due_date__lte',
            ],
          },
          {
            label: 'Recurring invoices',
            query: {
              type: 'invoice',
              status__in: ['recurring'],
            },
            filters: ['document_id__contains', 'counterpart_id'],
          },
          {
            label: 'Other Invoices',
            query: {
              type: 'invoice',
              sort: 'created_at',
              order: 'desc',
              status__in: [
                'issued',
                'overdue',
                'partially_paid',
                'paid',
                'uncollectible',
                'canceled',
              ],
            },
          },
          {
            label: 'Credit notes',
            query: {
              type: 'credit_note',
            },
          },
        ],
      },
    },
  })),
  render: (args) => {
    return (
      <div style={{ padding: 20 }}>
        <ReceivablesTable {...args} onTabChange={undefined} />
      </div>
    );
  },
};

export default meta;
