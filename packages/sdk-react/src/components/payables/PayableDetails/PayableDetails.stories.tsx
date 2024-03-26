import { useState } from 'react';

import { Dialog } from '@/components/Dialog';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import { MoniteSDK } from '@monite/sdk-api';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_LOW_PERMISSIONS,
  PAYABLE_ID_WITHOUT_FILE,
} from '../../../mocks';
import { PayableDetails } from './PayableDetails';

const meta: Meta<typeof PayableDetails> = {
  title: 'Payables/Payables — Details View',
  component: PayableDetails,
};

type Story = StoryObj<typeof PayableDetails>;

const actions = {
  // storybook adds action functions to properties, so we need to reset deprecated ones intentionally
  onSave: undefined,
  onCancel: undefined,
  onSubmit: undefined,
  onReject: undefined,
  onApprove: undefined,
  onSaved: action('onSaved'),
  onCanceled: action('onCanceled'),
  onSubmitted: action('onSubmitted'),
  onRejected: action('onRejected'),
  onApproved: action('onApproved'),
  onPay: action('onPay'),
};

export const DialogDetailsView: Story = {
  args: {
    id: '9a3b97a5-a1ba-4d8c-bade-ad3c47ae61e0',
    ...actions,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState<boolean>(true);

    return (
      <Dialog
        open={open}
        fullScreen
        {...args}
        onClose={() => {
          action('onClose')();
          setOpen(false);
        }}
        // onSubmit types are incompatible due to the spread operator
        onSubmit={() => {}}
        onClosed={action('onClosed')}
      >
        <PayableDetails {...args} />
      </Dialog>
    );
  },
};

export const FullPermissions: Story = {
  args: {
    id: '9a3b97a5-a1ba-4d8c-bade-ad3c47ae61e0',
    ...actions,
  },
  render: (args) => <PayableDetails {...args} />,
};

export const LowPermissions: Story = {
  args: {
    id: '9a3b97a5-a1ba-4d8c-bade-ad3c47ae61e0',
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
  render: (args) => {
    return <PayableDetails {...args} />;
  },
};

export const EmptyPermissions: Story = {
  args: {
    id: '9a3b97a5-a1ba-4d8c-bade-ad3c47ae61e0',
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
  render: (args) => {
    return <PayableDetails {...args} />;
  },
};

export const CreatePayable: Story = {
  args: {
    ...actions,
  },
  render: (args) => {
    return <PayableDetails {...args} />;
  },
};

export const AttachFilePayable: Story = {
  args: {
    id: PAYABLE_ID_WITHOUT_FILE,
    ...actions,
  },
  render: (args) => {
    return <PayableDetails {...args} />;
  },
};

export default meta;
