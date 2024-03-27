import { ENTITY_ID_FOR_LOW_PERMISSIONS } from '@/mocks';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import { css } from '@emotion/react';
import { MoniteSDK } from '@monite/sdk-api';
import { StoryObj } from '@storybook/react';

import { Products as ProductsComponent } from './Products';

const Story = {
  title: 'Products',
  component: ProductsComponent,
};

type Story = StoryObj<typeof ProductsComponent>;

export const Products: Story = {
  args: {},
  render: () => (
    <div
      css={css`
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding: 20px;
      `}
    >
      <ProductsComponent />
    </div>
  ),
};

export const ProductsLowPermissions: Story = {
  args: {},
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
  render: () => (
    <div
      css={css`
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding: 20px;
      `}
    >
      <ProductsComponent />
    </div>
  ),
};

export default Story;
