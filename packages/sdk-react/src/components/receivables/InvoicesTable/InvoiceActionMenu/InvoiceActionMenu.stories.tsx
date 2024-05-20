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

export const Basic: Story = {
  args: {
    invoice: { id: '1', status: ReceivablesStatusEnum.DRAFT },
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        maxWidth="50%"
      >
        <ArrowRightAltOutlined fontSize="large" color="warning" />
        <InvoiceActionsComponent {...args} />
      </Box>
      <Alert sx={{ mt: 2 }}>
        <code>{'<InvoiceActions />'}</code> could be customized through MUI
        theming
      </Alert>
    </div>
  ),
};

export const Customized: Story = {
  args: {
    invoice: { id: '1', status: ReceivablesStatusEnum.DRAFT },
  },
  name: 'Custom Draft actions',
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <ExtendThemeProvider
        theme={{
          components: {
            MoniteInvoiceActionMenu: {
              defaultProps: {
                actions: {
                  [ReceivablesStatusEnum.DRAFT]: ['delete', 'edit', 'issue'],
                },
                slotProps: {
                  root: { size: 'large' },
                  menu: {
                    anchorOrigin: {
                      vertical: 'center',
                      horizontal: 'center',
                    },
                  },
                },
              },
              styleOverrides: {
                root: {
                  outline: 'solid red 1px',
                },
              },
            },
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          maxWidth="50%"
        >
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
