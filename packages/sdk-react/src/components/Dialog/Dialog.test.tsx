import React from 'react';

import { renderWithClient } from '@/utils/test-utils';
import { screen } from '@testing-library/react';

import { Dialog } from './Dialog';

describe('Dialog Component', () => {
  test('should render content when Dialog is "open"', () => {
    const props = {
      open: true,
      onClosed: jest.fn(),
      onClose: jest.fn(),
    };

    renderWithClient(
      <Dialog alignDialog="left" {...props}>
        Dialog component
      </Dialog>
    );

    expect(screen.getByText(/Dialog component/)).toBeInTheDocument();
  });
});
