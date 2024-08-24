import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { PaymentTermsForm as PaymentTermsFormComponent } from './PaymentTermsForm';

const meta: Meta<typeof PaymentTermsFormComponent> = {
  title: 'Receivables / PaymentTermsForm',
  component: PaymentTermsFormComponent,
};

type Story = StoryObj<typeof PaymentTermsFormComponent>;

export const PaymentTermsForm: Story = {
  render: (args) => (
    <Box sx={{ maxWidth: 600, mx: 'auto', height: '100%' }}>
      <PaymentTermsFormComponent {...args} />
    </Box>
  ),
};

export default meta;
