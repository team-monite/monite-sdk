import { Alert } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Alert> = {
  title: 'Components / Alert',
  component: Alert,
};

type Story = StoryObj<typeof Alert>;

export const AlertDefault: Story = {
  name: 'Default',
  render: () => (
    <div style={{ padding: 20, display: 'flex', gap: 20 }}>
      <Alert severity="success">This is a success Alert.</Alert>
      <Alert severity="info">This is an info Alert.</Alert>
      <Alert severity="warning">This is a warning Alert.</Alert>
      <Alert severity="error">This is an error Alert.</Alert>
    </div>
  ),
};

export default meta;
