import { ExtendThemeProvider } from '@/utils/ExtendThemeProvider';
import { Alert } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { ApprovalStatusChip as ApprovalStatusChipComponent } from './ApprovalStatusChip';

const meta: Meta<typeof ApprovalStatusChipComponent> = {
  title: 'Components / ApprovalStatusChip',
  component: ApprovalStatusChipComponent,
};

type Story = StoryObj<typeof ApprovalStatusChipComponent>;

export const ApprovalStatusChip: Story = {
  args: {
    status: 'active',
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <ExtendThemeProvider
        theme={{
          components: {
            MoniteApprovalStatusChip: {
              defaultProps: {
                icon: true,
              },
              variants: [
                {
                  props: { status: 'active' },
                  style: {
                    border: '2px dashed blue',
                  },
                },
                {
                  props: { status: 'deleted' },
                  style: {
                    border: '2px dashed orange',
                  },
                },
              ],
            },
          },
        }}
      >
        <ApprovalStatusChipComponent {...args} />
      </ExtendThemeProvider>

      <Alert sx={{ mt: 2 }}>
        <code>{'<ApprovalStatusChip />'}</code> could be customized through MUI
        theming
      </Alert>
    </div>
  ),
};

export default meta;
