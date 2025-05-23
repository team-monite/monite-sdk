import { vi } from 'vitest';
import { Dialog } from '@/components';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { individualId } from '@/mocks/counterparts/counterpart.mocks.types';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';

import { CounterpartIndividualForm } from './CounterpartIndividualForm';

describe('CounterpartIndividualForm', () => {
  describe('# Existing Individual', () => {
    test('should show "Cancel" button', async () => {
      renderWithClient(
        <CounterpartIndividualForm id={individualId} showCategories />
      );

      await waitUntilTableIsLoaded();

      const cancelButton = await screen.findByRole('button', {
        name: /Cancel/i,
      });

      expect(cancelButton).toBeInTheDocument();
    });

    test('should call onCancel when cancel button is clicked for existing individual', async () => {
      const onCancelMock = vi.fn();

      renderWithClient(
        <MoniteScopedProviders>
          <CounterpartIndividualForm
            id={individualId}
            showCategories
            onCancel={onCancelMock}
          />
        </MoniteScopedProviders>
      );

      await waitUntilTableIsLoaded();

      const cancelButton = await screen.findByRole('button', {
        name: /Cancel/i,
      });

      await act(() => fireEvent.click(cancelButton));

      await waitFor(() => {
        expect(onCancelMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('# New Individual', () => {
    test.skip('should show "Cancel" button when in Dialog component', async () => {
      renderWithClient(
        <Dialog open>
          <CounterpartIndividualForm showCategories />
        </Dialog>
      );

      await waitUntilTableIsLoaded();

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });

      expect(cancelButton).toBeInTheDocument();
    });

    test.skip('should NOT show "Cancel" button when NOT in Dialog component', async () => {
      renderWithClient(<CounterpartIndividualForm showCategories />);

      await waitUntilTableIsLoaded();

      const cancelButton = screen.queryByRole('button', { name: /Cancel/i });

      expect(cancelButton).not.toBeInTheDocument();
    });

    test.skip('should call onCancel when cancel button is clicked for new individual in Dialog', async () => {
      const onCancelMock = vi.fn();

      renderWithClient(
        <Dialog open onClose={onCancelMock}>
          <CounterpartIndividualForm showCategories />
        </Dialog>
      );

      await waitUntilTableIsLoaded();

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });

      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(onCancelMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
