import React from 'react';

import { renderWithClient } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { ConfirmDeleteModal } from './ConfirmDeleteModal';

describe('ConfirmDeleteModal', () => {
  test('should trigger `onClose` callback when click on "cancel" button', () => {
    const onCloseMock = jest.fn();

    renderWithClient(
      <ConfirmDeleteModal
        modalOpened={true}
        tag={{
          id: '1',
          name: 'Tag name',
        }}
        onClose={onCloseMock}
        onDelete={() => {}}
      />
    );

    const cancelButton = screen.getByRole('button', {
      name: t`Cancel`,
    });

    expect(cancelButton).toBeInTheDocument();

    expect(onCloseMock).not.toHaveBeenCalled();
    fireEvent.click(cancelButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('should trigger `onDelete` and `onClose` callbacks when click on "delete" button', async () => {
    const onDeleteMock = jest.fn();
    const onCloseMock = jest.fn();

    renderWithClient(
      <ConfirmDeleteModal
        modalOpened={true}
        tag={{
          id: '1',
          name: 'Tag name',
        }}
        onClose={onCloseMock}
        onDelete={onDeleteMock}
      />
    );

    const deleteButton = screen.getByRole('button', {
      name: t`Delete`,
    });

    expect(deleteButton).toBeInTheDocument();
    expect(onCloseMock).not.toHaveBeenCalled();
    expect(onDeleteMock).not.toHaveBeenCalled();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });

  test('should NOT trigger `onDelete` and `onClose` callbacks when response failed', async () => {
    const onDeleteMock = jest.fn();
    const onCloseMock = jest.fn();

    renderWithClient(
      <ConfirmDeleteModal
        modalOpened={true}
        tag={{
          id: '0',
          name: 'Tag name',
        }}
        onClose={onCloseMock}
        onDelete={onDeleteMock}
      />
    );

    const deleteButton = screen.getByRole('button', {
      name: t`Delete`,
    });

    expect(deleteButton).toBeInTheDocument();
    expect(onCloseMock).not.toHaveBeenCalled();
    expect(onDeleteMock).not.toHaveBeenCalled();

    fireEvent.click(deleteButton);

    await waitFor(
      () => {
        expect(onCloseMock).not.toHaveBeenCalled();
      },
      {
        timeout: 500,
      }
    );

    expect(onDeleteMock).not.toHaveBeenCalled();
  });
});
