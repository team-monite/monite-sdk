import { ExtendThemeProvider } from '@/utils/ExtendThemeProvider';
import { ReceivablesStatusEnum } from '@monite/sdk-api';
import { ArrowRightAltOutlined } from '@mui/icons-material';
import { Alert, Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceActionMenu as InvoiceActionsComponent } from './InvoiceActionMenu';

const meta: Meta<typeof InvoiceActionsComponent> = {
  title: 'Components / InvoiceActionMenu',
  component: InvoiceActionsComponent,
  argTypes: {
    invoice: {
      options: Object.values(ReceivablesStatusEnum),
      mapping: Object.fromEntries(
        Object.values(ReceivablesStatusEnum).map((status, id) => [
          status,
          { id: id.toString(), status },
        ])
      ),
    },
  },
};

type Story = StoryObj<typeof InvoiceActionsComponent>;

export const InvoiceActions: Story = {
  args: {
    invoice: { id: '1', status: ReceivablesStatusEnum.PAID },
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <ExtendThemeProvider
        theme={{
          components: {
            MoniteInvoiceStatusChip: {
              defaultProps: {
                icon: true,
              },
              variants: [
                {
                  props: { status: ReceivablesStatusEnum.PAID },
                  style: {
                    border: '2px dashed lightgreen',
                  },
                },
                {
                  props: { status: ReceivablesStatusEnum.OVERDUE },
                  style: {
                    border: '2px dashed red',
                  },
                },
              ],
            },
          },
        }}
      >
        <Box display="flex" justifyContent="flex-end">
          <ArrowRightAltOutlined fontSize="large" color="warning" />
          <InvoiceActionsComponent {...args} />
        </Box>
      </ExtendThemeProvider>
      <Alert sx={{ mt: 2 }}>
        <code>{'<InvoiceActions />'}</code> could be customized through MUI
        theming
      </Alert>
    </div>
  ),
};

export default meta;
