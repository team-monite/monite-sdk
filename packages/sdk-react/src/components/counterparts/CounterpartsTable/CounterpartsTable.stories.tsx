import { CounterpartsTable } from '@/components';
import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_READONLY_PERMISSIONS,
} from '@/mocks';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

const meta: Meta<typeof CounterpartsTable> = {
  title: 'Counterparts/Counterparts — Table View',
  component: CounterpartsTable,
};

type Story = StoryObj<typeof CounterpartsTable>;

export const FullPermissions: Story = {
  args: {
    onRowClick: action('onRowClick'),
    onChangeSort: action('onChangeSort'),
    onChangeFilter: action('onChangeFilter'),
    showCategories: true,
  },
  render: (args) => (
    <div style={{ padding: 20 }}>
      <CounterpartsTable {...args} />
    </div>
  ),
};

export const WithReadOnlyPermissions: Story = {
  args: {
    onRowClick: action('onRowClick'),
    onChangeSort: action('onChangeSort'),
    onChangeFilter: action('onChangeFilter'),
  },
  decorators: [
    withGlobalStorybookDecorator(() => {
      const monite = {
        fetchToken: () =>
          Promise.resolve({
            access_token: 'ueaohsueahtsueahs',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        entityId: ENTITY_ID_FOR_READONLY_PERMISSIONS,
      };

      return { monite };
    }),
  ],
  render: (args) => (
    <div style={{ padding: 20 }}>
      <CounterpartsTable {...args} />
    </div>
  ),
};

export const WithEmptyPermissions: Story = {
  args: {
    onRowClick: action('onRowClick'),
    onChangeSort: action('onChangeSort'),
    onChangeFilter: action('onChangeFilter'),
  },
  decorators: [
    withGlobalStorybookDecorator(() => {
      const monite = {
        fetchToken: () =>
          Promise.resolve({
            access_token: 'ueaohsueahtsueahs',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
      };

      return { monite };
    }),
  ],
  render: (args) => (
    <div style={{ padding: 20 }}>
      <CounterpartsTable {...args} />
    </div>
  ),
};
export default meta;
