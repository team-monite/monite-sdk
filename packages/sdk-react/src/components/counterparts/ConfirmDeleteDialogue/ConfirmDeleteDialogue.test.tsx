import React from 'react';

import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { renderWithClient } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { ConfirmDeleteDialogue } from './ConfirmDeleteDialogue';

describe('CounterpartConfirmDeleteModal', () => {
  test('should trigger "onDelete" callback when we click on "delete" button', async () => {
    const onDeleteMock = jest.fn();

    renderWithClient(
      <MoniteStyleProvider>
        <ConfirmDeleteDialogue
          open
          type="individual"
          name="individual"
          isLoading={false}
          onClose={jest.fn()}
          onDelete={onDeleteMock}
        />
      </MoniteStyleProvider>
    );

    const deleteText = t`Delete`;
    const deleteButton = screen.getByRole('button', {
      name: deleteText,
    });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalled();
    });
  });

  test('should trigger "onCancel" callback when we click on "cancel" button', async () => {
    const onCancelMock = jest.fn();

    renderWithClient(
      <MoniteStyleProvider>
        <ConfirmDeleteDialogue
          open
          type="individual"
          name="individual"
          isLoading={false}
          onClose={onCancelMock}
          onDelete={jest.fn()}
        />
      </MoniteStyleProvider>
    );

    const cancelText = t`Cancel`;
    const cancelButton = screen.getByRole('button', {
      name: cancelText,
    });

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(onCancelMock).toHaveBeenCalled();
    });
  });
});
