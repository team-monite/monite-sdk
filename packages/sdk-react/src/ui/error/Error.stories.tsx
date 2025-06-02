import { useDialog } from '@/components/Dialog';
import { useState } from 'react';

import { Button } from '@mui/material';
import { ErrorBoundary } from '@sentry/react';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { ErrorBase } from './Error';

const meta: Meta<typeof ErrorBase> = {
  title: 'components/Error',
  component: ErrorBase,
};

type Story = StoryObj<typeof ErrorBase>;

const ButtonWithThrowError = () => {
  const [error, setError] = useState<Error>();

  if (error) throw new Error('Error thrown from button');

  return (
    <Button
      onClick={() => {
        try {
          throw new Error('Error thrown from button');
        } catch (error) {
          if (error instanceof Error) setError(error);
        }
      }}
    >
      Click to throw an error
    </Button>
  );
};

export const Default: Story = {
  render: () => {
    const dialogContext = useDialog();

    return (
      <ErrorBoundary
        fallback={(props) => <ErrorBase onClose={dialogContext?.onClose} {...props} />}
        onError={action('onError')}
      >
        <ButtonWithThrowError />
      </ErrorBoundary>
    );
  },
};

export default meta;
