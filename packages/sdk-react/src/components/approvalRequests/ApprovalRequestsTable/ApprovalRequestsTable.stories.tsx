import { ApprovalRequestsTable } from './ApprovalRequestsTable';
import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_READONLY_PERMISSIONS,
} from '@/mocks';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

const meta: Meta<typeof ApprovalRequestsTable> = {
  title: 'Approval Requests/Approval Requests — Table View',
  component: ApprovalRequestsTable,
};

type Story = StoryObj<typeof ApprovalRequestsTable>;

export const FullPermissions: Story = {
  args: {
    onRowClick: action('onRowClick'),
  },
  render: (args) => (
    <div style={{ padding: 20 }}>
      <ApprovalRequestsTable {...args} />
    </div>
  ),
};

export const ReadOnlyPermissions: Story = {
  args: {
    onRowClick: action('onRowClick'),
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
      <ApprovalRequestsTable {...args} />
    </div>
  ),
};

export const LowPermissions: Story = {
  args: {
    onRowClick: action('onRowClick'),
  },
  decorators: [
    withGlobalStorybookDecorator(() => {
      const monite = {
        fetchToken: () =>
          Promise.resolve({
            access_token: '_',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
      };

      return { monite };
    }),
  ],
  render: (args) => {
    return (
      <div style={{ height: 600, padding: 20 }}>
        <ApprovalRequestsTable {...args} />
      </div>
    );
  },
};

export default meta;
