import { ExtendThemeProvider } from '@/utils/storybook-utils';
import { PayableStateEnum } from '@monite/sdk-api';
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
    status: PayableStateEnum.PAID,
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
                  props: { status: PayableStateEnum.PAID },
                  style: {
                    border: '2px dashed blue',
                  },
                },
                {
                  props: { status: PayableStateEnum.APPROVE_IN_PROGRESS },
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
