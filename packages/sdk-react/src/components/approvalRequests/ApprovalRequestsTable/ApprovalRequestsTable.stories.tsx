import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_READONLY_PERMISSIONS,
} from '@/mocks';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import { MoniteSDK } from '@monite/sdk-api';
import { Meta, StoryObj } from '@storybook/react';

import { ApprovalRequestsTable } from './ApprovalRequestsTable';

const meta: Meta<typeof ApprovalRequestsTable> = {
  title: 'Approval Requests/Approval Requests — Table View',
  component: ApprovalRequestsTable,
};

type Story = StoryObj<typeof ApprovalRequestsTable>;

export const FullPermissions: Story = {
  render: (args) => (
    <div style={{ height: 600 }}>
      <ApprovalRequestsTable {...args} />
    </div>
  ),
};

export const ReadOnlyPermissions: Story = {
  decorators: [
    withGlobalStorybookDecorator(() => {
      const monite = new MoniteSDK({
        fetchToken: () =>
          Promise.resolve({
            access_token: 'ueaohsueahtsueahs',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        entityId: ENTITY_ID_FOR_READONLY_PERMISSIONS,
      });

      return { monite };
    }),
  ],
  render: (args) => (
    <div style={{ height: 600 }}>
      <ApprovalRequestsTable {...args} />
    </div>
  ),
};

export const LowPermissions: Story = {
  decorators: [
    withGlobalStorybookDecorator(() => {
      const monite = new MoniteSDK({
        fetchToken: () =>
          Promise.resolve({
            access_token: '_',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
      });

      return { monite };
    }),
  ],
  render: (args) => {
    return (
      <div style={{ height: 600 }}>
        <ApprovalRequestsTable {...args} />
      </div>
    );
  },
};

export default meta;
