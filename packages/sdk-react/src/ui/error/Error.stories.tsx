import { useState } from 'react';

import { useDialog } from '@/components/Dialog';
import { Button } from '@mui/material';
import { ErrorBoundary } from '@sentry/react';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { ErrorComponent } from './Error';

const meta: Meta<typeof ErrorComponent> = {
  title: 'components/Error',
  component: ErrorComponent,
};

type Story = StoryObj<typeof ErrorComponent>;

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

const ErrorStoryComponent = () => {
  const dialogContext = useDialog();

  return (
    <ErrorBoundary
      fallback={(props) => (
        <ErrorComponent onClose={dialogContext?.onClose} {...props} />
      )}
      onError={action('onError')}
    >
      <ButtonWithThrowError />
    </ErrorBoundary>
  );
};

export const Default: Story = {
  render: () => <ErrorStoryComponent />,
};

export default meta;
