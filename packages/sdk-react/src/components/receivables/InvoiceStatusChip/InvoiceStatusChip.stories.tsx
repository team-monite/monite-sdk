import { ExtendThemeProvider } from '@/utils/ExtendThemeProvider';
import { Alert } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceStatusChip as InvoiceStatusChipComponent } from './InvoiceStatusChip';

const meta: Meta<typeof InvoiceStatusChipComponent> = {
  title: 'Components / InvoiceStatusChip',
  component: InvoiceStatusChipComponent,
};

type Story = StoryObj<typeof InvoiceStatusChipComponent>;

export const InvoiceStatusChip: Story = {
  args: {
    status: 'paid',
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <ExtendThemeProvider
        theme={{
          components: {
            MoniteInvoiceStatusChip: {
              defaultProps: {
                icon: true,
              },
              variants: [
                {
                  props: { status: 'paid' },
                  style: {
                    border: '2px dashed lightgreen',
                  },
                },
                {
                  props: { status: 'overdue' },
                  style: {
                    border: '2px dashed red',
                  },
                },
              ],
            },
          },
        }}
      >
        <InvoiceStatusChipComponent {...args} />
      </ExtendThemeProvider>
      <Alert sx={{ mt: 2 }}>
        <code>{'<InvoiceStatusChip />'}</code> could be customized through MUI
        theming
      </Alert>
    </div>
  ),
};

export default meta;
