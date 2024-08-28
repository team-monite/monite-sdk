import { DataGridEmptyState } from '@/ui/DataGridEmptyState/DataGridEmptyState';
import { ExtendThemeProvider } from '@/utils/ExtendThemeProvider';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DataGridEmptyState> = {
  title: 'Components/DataGridEmptyState',
  component: DataGridEmptyState,
};

type Story = StoryObj<typeof DataGridEmptyState>;

const actions = {
  onAction: action('onAction'),
};

export const NoDataSales: Story = {
  args: {
    type: 'no-data',
    table: 'Sales',
    ...actions,
  },
  render: (args) => (
    <ExtendThemeProvider
      theme={{
        components: {
          DataGridEmptyState: {
            defaultProps: {
              type: 'no-data',
              table: 'Sales',
            },
          },
        },
      }}
    >
      <DataGridEmptyState {...args} />
    </ExtendThemeProvider>
  ),
};

export const ErrorSales: Story = {
  args: {
    type: 'error',
    table: 'Sales',
    ...actions,
  },
  render: (args) => (
    <ExtendThemeProvider
      theme={{
        components: {
          DataGridEmptyState: {
            defaultProps: {
              type: 'error',
              table: 'Sales',
            },
          },
        },
      }}
    >
      <DataGridEmptyState {...args} />
    </ExtendThemeProvider>
  ),
};

export const AccessRestrictedSales: Story = {
  args: {
    type: 'access-restricted',
    table: 'Sales',
  },
  render: (args) => (
    <ExtendThemeProvider
      theme={{
        components: {
          DataGridEmptyState: {
            defaultProps: {
              type: 'access-restricted',
              table: 'Sales',
            },
          },
        },
      }}
    >
      <DataGridEmptyState {...args} />
    </ExtendThemeProvider>
  ),
};

export const UnsupportedCountrySales: Story = {
  args: {
    type: 'unsupported-country',
    table: 'Sales',
  },
  render: (args) => (
    <ExtendThemeProvider
      theme={{
        components: {
          DataGridEmptyState: {
            defaultProps: {
              type: 'unsupported-country',
              table: 'Sales',
            },
          },
        },
      }}
    >
      <DataGridEmptyState {...args} />
    </ExtendThemeProvider>
  ),
};

export default meta;
