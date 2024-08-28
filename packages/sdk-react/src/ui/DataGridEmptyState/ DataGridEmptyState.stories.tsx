import { DataGridEmptyState } from '@/ui/DataGridEmptyState/DataGridEmptyState';
import NoDataIcon from '@mui/icons-material/Block';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import CountryUnsupportedIcon from '@mui/icons-material/HourglassEmpty';
import AccessRestrictedIcon from '@mui/icons-material/Lock';
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
    icon: (
      <NoDataIcon sx={{ fontSize: '4rem', color: 'primary.main', mb: 2 }} />
    ),
    title: 'No Sales',
    descriptionLine1: 'You don’t have any sales documents added yet.',
    descriptionLine2: 'You can create your first quote or invoice.',
    actionButtonLabel: 'Create New',
    actionOptions: ['Create Invoice', 'Create Quote'],
    type: 'no-data',
    ...actions,
  },
  render: (args) => <DataGridEmptyState {...args} />,
};

export const ErrorSales: Story = {
  args: {
    icon: <ErrorIcon sx={{ fontSize: '4rem', color: 'error.main', mb: 2 }} />,
    title: 'Failed to load sales documents',
    descriptionLine1: 'Please try to reload.',
    descriptionLine2: 'If the error recurs, contact support.',
    actionButtonLabel: 'Reload page',
    type: 'error',
    ...actions,
  },
  render: (args) => <DataGridEmptyState {...args} />,
};

export const AccessRestrictedSales: Story = {
  args: {
    icon: (
      <AccessRestrictedIcon
        sx={{ fontSize: '4rem', color: 'grey.500', mb: 2 }}
      />
    ),
    title: 'Access Restricted',
    descriptionLine1: 'You don’t have permissions to view this page.',
    descriptionLine2: 'Contact your system administrator for details.',
    actionButtonLabel: '',
    type: 'access-restricted',
  },
  render: (args) => <DataGridEmptyState {...args} />,
};

export const UnsupportedCountrySales: Story = {
  args: {
    icon: (
      <CountryUnsupportedIcon
        sx={{ fontSize: '4rem', color: 'grey.500', mb: 2 }}
      />
    ),
    title: 'We don’t support invoicing in your country yet',
    descriptionLine1:
      'Tax rates and regulations are currently not supported for your country.',
    descriptionLine2: 'Unfortunately, you can’t issue documents.',
    actionButtonLabel: '',
    type: 'unsupported-country',
  },
  render: (args) => <DataGridEmptyState {...args} />,
};

export const NoDataProducts: Story = {
  args: {
    icon: (
      <NoDataIcon sx={{ fontSize: '4rem', color: 'primary.main', mb: 2 }} />
    ),
    title: 'No Products',
    descriptionLine1: 'You don’t have any products added yet.',
    descriptionLine2: 'You can add a new product.',
    actionButtonLabel: 'Add New Product',
    actionOptions: ['Products', 'Import from file'],
    type: 'no-data',
    ...actions,
  },
  render: (args) => <DataGridEmptyState {...args} />,
};

export default meta;
