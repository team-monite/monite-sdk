import { CounterpartStatusChip as CounterpartStatusChipComponent } from './CounterpartStatusChip';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof CounterpartStatusChipComponent> = {
  title: 'Components / CounterpartStatusChip',
  component: CounterpartStatusChipComponent,
};

type Story = StoryObj<typeof CounterpartStatusChipComponent>;

export const CounterpartStatusChip: Story = {
  args: {
    status: 'customer',
  },
  decorators: withGlobalStorybookDecorator(() => ({
    theme: {
      components: {
        counterpartStatusChip: {
          size: 'medium',
          variant: 'outlined',
        },
      },
    },
  })),
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <CounterpartStatusChipComponent {...args} />
    </div>
  ),
};

export default meta;
