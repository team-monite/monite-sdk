import { useState } from 'react';

import { Dialog } from '@/components';
import { receivableListFixture } from '@/mocks';
import { ReceivablesStatusEnum } from '@monite/sdk-api';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoicePreviewScreen } from './InvoicePreviewScreen';

const meta: Meta<typeof InvoicePreviewScreen> = {
  title: 'Receivables/Invoices — PreviewScreen',
  component: InvoicePreviewScreen,
};

type Story = StoryObj<typeof InvoicePreviewScreen>;

export const PreviewScreenView: Story = {
  args: {
    receivableId: receivableListFixture.invoice.find(
      (inv) => inv.status === ReceivablesStatusEnum.DRAFT
    )?.id,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState<boolean>(true);

    return (
      <Dialog open={open} fullScreen onClose={() => setOpen(false)}>
        <InvoicePreviewScreen {...args} />
      </Dialog>
    );
  },
};

export default meta;
