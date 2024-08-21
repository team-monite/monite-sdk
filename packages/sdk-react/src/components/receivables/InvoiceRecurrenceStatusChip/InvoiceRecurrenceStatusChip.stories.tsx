import { ExtendThemeProvider } from '@/utils/ExtendThemeProvider';
import { Alert } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceRecurrenceStatusChip as InvoiceRecurrenceStatusChipComponent } from './InvoiceRecurrenceStatusChip';

const meta: Meta<typeof InvoiceRecurrenceStatusChipComponent> = {
  title: 'Components / InvoiceRecurrenceStatusChip',
  component: InvoiceRecurrenceStatusChipComponent,
};

type Story = StoryObj<typeof InvoiceRecurrenceStatusChipComponent>;

export const InvoiceRecurrenceStatusChip: Story = {
  args: {
    status: 'active',
    icon: true,
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <ExtendThemeProvider
        theme={{
          components: {
            MoniteInvoiceRecurrenceStatusChip: {
              variants: [
                {
                  props: { status: 'active' },
                  style: {
                    border: '2px dashed lightgreen',
                  },
                },
                {
                  props: { status: 'canceled' },
                  style: {
                    border: '2px dashed red',
                  },
                },
                {
                  props: { status: 'completed' },
                  style: {
                    border: '2px dashed blue',
                  },
                },
              ],
            },
          },
        }}
      >
        <InvoiceRecurrenceStatusChipComponent {...args} />
      </ExtendThemeProvider>
      <Alert sx={{ mt: 2 }}>
        <code>{'<InvoiceRecurrenceStatusChip />'}</code> could be customized
        through MUI theming
      </Alert>
    </div>
  ),
};

export default meta;
