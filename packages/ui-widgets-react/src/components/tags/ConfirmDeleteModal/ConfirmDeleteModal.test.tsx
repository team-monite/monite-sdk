import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithClient } from 'utils/test-utils';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import i18n from '../../../core/i18n';

describe('ConfirmDeleteModal', () => {
  test('should trigger `onClose` callback when click on "cancel" button', () => {
    const onCloseMock = jest.fn();

    renderWithClient(
      <ConfirmDeleteModal
        tag={{
          id: '1',
          name: 'Tag name',
        }}
        onClose={onCloseMock}
        onDelete={() => {}}
      />
    );

    const cancelButton = screen.getByRole('button', {
      name: i18n.t('common:cancel'),
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
        tag={{
          id: '1',
          name: 'Tag name',
        }}
        onClose={onCloseMock}
        onDelete={onDeleteMock}
      />
    );

    const deleteButton = screen.getByRole('button', {
      name: i18n.t('common:delete'),
    });

    expect(deleteButton).toBeInTheDocument();
    expect(onCloseMock).not.toHaveBeenCalled();
    expect(onDeleteMock).not.toHaveBeenCalled();

    fireEvent.click(deleteButton);

    /** Wait until we see tooltip that the tag has been deleted */
    await screen.findByText(/was deleted/);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });

  test('should NOT trigger `onDelete` and `onClose` callbacks when response failed', async () => {
    const onDeleteMock = jest.fn();
    const onCloseMock = jest.fn();

    renderWithClient(
      <ConfirmDeleteModal
        tag={{
          id: '0',
          name: 'Tag name',
        }}
        onClose={onCloseMock}
        onDelete={onDeleteMock}
      />
    );

    const deleteButton = screen.getByRole('button', {
      name: i18n.t('common:delete'),
    });

    expect(deleteButton).toBeInTheDocument();
    expect(onCloseMock).not.toHaveBeenCalled();
    expect(onDeleteMock).not.toHaveBeenCalled();

    fireEvent.click(deleteButton);

    /** Wait until we see tooltip that the tag has been deleted */
    await screen.findByText(/was deleted/);

    expect(onCloseMock).not.toHaveBeenCalled();
    expect(onDeleteMock).not.toHaveBeenCalled();
  });
});
