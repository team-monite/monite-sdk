'use client';

import { useState } from 'react';

import { Dialog } from '@/components/Dialog';
import {
  ENTITY_ID_FOR_LOW_PERMISSIONS,
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
} from '@/mocks';
import { productsListFixture } from '@/mocks/products';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import { MoniteSDK } from '@monite/sdk-api';
import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';

import { ProductDetails } from './ProductDetails';

const meta: Meta<typeof ProductDetails> = {
  title: 'Products/Products — Details View',
  component: ProductDetails,
};

type Story = StoryObj<typeof ProductDetails>;

const actions = {
  onEdit: action('onEdit'),
};

const productId = productsListFixture[0].id;

const CenteredWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
    <div style={{ maxWidth: '800px', height: '100%', margin: '0 auto' }}>
      {children}
    </div>
  </div>
);

export const DialogDetailsView: Story = {
  args: {
    id: productId,
    ...actions,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState<boolean>(true);

    return (
      <Dialog
        open={open}
        alignDialog="right"
        onClose={() => {
          action('onClose')();
          setOpen(false);
        }}
      >
        <ProductDetails {...args} />
      </Dialog>
    );
  },
};

export const CreateProductDialog: Story = {
  args: {
    onCreated: action('onCreated'),
  },
  render: (args) => (
    <Dialog open alignDialog="right" onClose={action('onClose')}>
      <ProductDetails {...args} />
    </Dialog>
  ),
};

export const CreateProduct: Story = {
  args: {
    onCreated: action('onCreated'),
  },
  render: (args) => <ProductDetails {...args} />,
};

export const FullPermissions: Story = {
  args: {
    id: productId,
    ...actions,
  },
  render: (args) => (
    <CenteredWrapper>
      <ProductDetails {...args} />
    </CenteredWrapper>
  ),
};

export const LowPermissions: Story = {
  args: {
    id: productId,
    ...actions,
  },
  decorators: [
    withGlobalStorybookDecorator(() => {
      const monite = new MoniteSDK({
        fetchToken: () =>
          Promise.resolve({
            access_token: 'ueaohsueahtsueahs',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        entityId: ENTITY_ID_FOR_LOW_PERMISSIONS,
      });

      return { monite };
    }),
  ],
  render: (args) => (
    <CenteredWrapper>
      <ProductDetails {...args} />
    </CenteredWrapper>
  ),
};

export const EmptyPermissions: Story = {
  args: {
    id: productId,
    ...actions,
  },
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
  render: (args) => (
    <CenteredWrapper>
      <ProductDetails {...args} />
    </CenteredWrapper>
  ),
};

export const NotFound: Story = {
  args: {
    id: 'id-not-found',
    ...actions,
  },
  render: (args) => (
    <CenteredWrapper>
      <ProductDetails {...args} />
    </CenteredWrapper>
  ),
};

export default meta;
