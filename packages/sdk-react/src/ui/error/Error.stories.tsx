import { useState } from 'react';

import { Button } from '@mui/material';
import { ErrorBoundary } from '@sentry/react';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { Error as ErrorComponent } from './Error';

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

export const Default: Story = {
  render: () => {
    return (
      <ErrorBoundary
        fallback={(props) => <ErrorComponent {...props} />}
        onError={action('onError')}
      >
        <ButtonWithThrowError />
      </ErrorBoundary>
    );
  },
};

export default meta;
