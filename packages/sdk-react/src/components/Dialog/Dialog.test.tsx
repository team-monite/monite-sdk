import { renderWithClient } from '@/utils/test-utils';
import { screen } from '@testing-library/react';

import { test, vi } from 'vitest';

import { Dialog } from './Dialog';

describe('Dialog Component', () => {
  test.skip('should render content when Dialog is "open"', () => {
    const props = {
      onClose: vi.fn(),
    };

    renderWithClient(
      <Dialog alignDialog="left" open {...props}>
        Dialog component
      </Dialog>
    );

    expect(screen.getByText(/Dialog component/)).toBeInTheDocument();
  });
});
