import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_READONLY_PERMISSIONS,
} from '@/mocks';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import { MoniteSDK } from '@monite/sdk-api';
import { Meta, StoryObj } from '@storybook/react';

import { ProductsTable } from './ProductsTable';

const meta: Meta<typeof ProductsTable> = {
  title: 'Products/Products — Table View',
  component: ProductsTable,
};

type Story = StoryObj<typeof ProductsTable>;

export const FullPermissions: Story = {
  render: (args) => (
    <div style={{ height: 600, padding: 20 }}>
      <ProductsTable {...args} />
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
    <div style={{ height: 600, padding: 20 }}>
      <ProductsTable {...args} />
    </div>
  ),
};

export const LowPermissions: Story = {
  decorators: [
    withGlobalStorybookDecorator(() => {
      const monite = new MoniteSDK({
        fetchToken: () =>
          Promise.resolve({
            access_token: 'ueaohsueahtsueahs',
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
      <div style={{ height: 600, padding: 20 }}>
        <ProductsTable {...args} />
      </div>
    );
  },
};

export default meta;
