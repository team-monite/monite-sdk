import { ExtendThemeProvider } from '@/utils/ExtendThemeProvider';
import { Alert } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceRecurrenceIterationStatusChip as InvoiceRecurrenceIterationStatusChipComponent } from './InvoiceRecurrenceIterationStatusChip';

const meta: Meta<typeof InvoiceRecurrenceIterationStatusChipComponent> = {
  title: 'Components / InvoiceRecurrenceIterationStatusChip',
  component: InvoiceRecurrenceIterationStatusChipComponent,
};

type Story = StoryObj<typeof InvoiceRecurrenceIterationStatusChipComponent>;

export const InvoiceRecurrenceIterationStatusChip: Story = {
  args: {
    status: 'pending',
    icon: true,
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <ExtendThemeProvider
        theme={{
          components: {
            MoniteInvoiceRecurrenceIterationStatusChip: {
              variants: [
                {
                  props: { status: 'pending' },
                  style: {
                    border: '2px dashed orange',
                  },
                },
                {
                  props: { status: 'completed' },
                  style: {
                    border: '2px dashed green',
                  },
                },
                {
                  props: { status: 'canceled' },
                  style: {
                    border: '2px dashed red',
                  },
                },
                {
                  props: { status: 'issue_failed' },
                  style: {
                    border: '2px dashed purple',
                  },
                },
                {
                  props: { status: 'send_failed' },
                  style: {
                    border: '2px dashed brown',
                  },
                },
              ],
            },
          },
        }}
      >
        <InvoiceRecurrenceIterationStatusChipComponent {...args} />
      </ExtendThemeProvider>
      <Alert sx={{ mt: 2 }}>
        <code>{'<InvoiceRecurrenceIterationStatusChip />'}</code> could be
        customized through MUI theming
      </Alert>
    </div>
  ),
};

export default meta;
