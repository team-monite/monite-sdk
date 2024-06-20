import { ExtendThemeProvider } from '@/utils/ExtendThemeProvider';
import { Alert } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { ApprovalRequestStatus } from '../../consts';
import { ApprovalRequestStatusChip as ApprovalRequestStatusChipComponent } from './ApprovalRequestStatusChip';

const meta: Meta<typeof ApprovalRequestStatusChipComponent> = {
  title: 'Components / ApprovalRequestStatusChip',
  component: ApprovalRequestStatusChipComponent,
};

type Story = StoryObj<typeof ApprovalRequestStatusChipComponent>;

export const ApprovalRequestStatusChip: Story = {
  args: {
    status: ApprovalRequestStatus.APPROVED,
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <ExtendThemeProvider
        theme={{
          components: {
            MoniteApprovalRequestStatusChip: {
              defaultProps: {
                icon: true,
              },
              variants: [
                {
                  props: { status: ApprovalRequestStatus.APPROVED },
                  style: {
                    border: '2px dashed blue',
                  },
                },
                {
                  props: { status: ApprovalRequestStatus.REJECTED },
                  style: {
                    border: '2px dashed orange',
                  },
                },
              ],
            },
          },
        }}
      >
        <ApprovalRequestStatusChipComponent {...args} />
      </ExtendThemeProvider>

      <Alert sx={{ mt: 2 }}>
        <code>{'<ApprovalRequestStatusChip />'}</code> could be customized
        through MUI theming
      </Alert>
    </div>
  ),
};

export default meta;
