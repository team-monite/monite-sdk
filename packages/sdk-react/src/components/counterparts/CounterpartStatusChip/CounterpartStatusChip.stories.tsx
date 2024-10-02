import { ExtendThemeProvider } from '@/utils/ExtendThemeProvider';
import { Alert } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { CounterpartStatusChip as CounterpartStatusChipComponent } from './CounterpartStatusChip';

const meta: Meta<typeof CounterpartStatusChipComponent> = {
  title: 'Components / CounterpartStatusChip',
  component: CounterpartStatusChipComponent,
};

type Story = StoryObj<typeof CounterpartStatusChipComponent>;

export const CounterpartStatusChip: Story = {
  args: {
    status: 'customer',
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <ExtendThemeProvider
        theme={{
          components: {
            MoniteCounterpartStatusChip: {
              defaultProps: {},
              variants: [
                {
                  props: { status: 'customer' },
                  style: {
                    border: '2px dashed lightgreen',
                  },
                },
                {
                  props: { status: 'vendor' },
                  style: {
                    border: '2px dashed red',
                  },
                },
              ],
            },
          },
        }}
      >
        <CounterpartStatusChipComponent {...args} />
      </ExtendThemeProvider>
      <Alert sx={{ mt: 2 }}>
        <code>{'<CounterpartStatusChip />'}</code> could be customized through
        MUI theming
      </Alert>
    </div>
  ),
};

export default meta;
