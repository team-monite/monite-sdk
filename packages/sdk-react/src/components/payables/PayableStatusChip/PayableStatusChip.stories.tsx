import { ExtendThemeProvider } from '@/utils/ExtendThemeProvider';
import { Alert } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { PayableStatusChip as PayableStatusChipComponent } from './PayableStatusChip';

const meta: Meta<typeof PayableStatusChipComponent> = {
  title: 'Components / PayableStatusChip',
  component: PayableStatusChipComponent,
};

type Story = StoryObj<typeof PayableStatusChipComponent>;

export const PayableStatusChip: Story = {
  args: {
    status: 'paid',
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <ExtendThemeProvider
        theme={{
          components: {
            MonitePayableStatusChip: {
              defaultProps: {
                icon: true,
              },
              variants: [
                {
                  props: { status: 'paid' },
                  style: {
                    border: '2px dashed blue',
                  },
                },
                {
                  props: { status: 'approve_in_progress' },
                  style: {
                    border: '2px dashed orange',
                  },
                },
              ],
            },
          },
        }}
      >
        <PayableStatusChipComponent {...args} />
      </ExtendThemeProvider>

      <Alert sx={{ mt: 2 }}>
        <code>{'<PayableStatusChip />'}</code> could be customized through MUI
        theming
      </Alert>
    </div>
  ),
};

export default meta;
