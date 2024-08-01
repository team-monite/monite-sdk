import { productsListFixture } from '@/mocks/products';
import { renderWithClient } from '@/utils/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { ProductEditForm } from './ProductEditForm';

describe('ProductEditForm', () => {
  describe('#Actions', () => {
    test('should trigger "onUpdate" callback with product when we click on "update" button', async () => {
      const onUpdateMock = jest.fn();

      renderWithClient(
        <ProductEditForm
          id={productsListFixture[0].id}
          onUpdated={onUpdateMock}
          onCanceled={jest.fn()}
        />
      );

      const saveButton = screen.findByRole('button', {
        name: 'Update',
      });

      await expect(saveButton).resolves.toBeInTheDocument();
      await waitFor(() => expect(saveButton).resolves.not.toBeDisabled());
      fireEvent.click(await saveButton);

      await waitFor(() => {
        expect(onUpdateMock).toHaveBeenCalledWith({
          ...productsListFixture[0],
          description: productsListFixture[0].description ?? '',
        });
      });
    });

    test('should trigger "onCancel" callback with product when we click on "cancel" button', async () => {
      const onCancelMock = jest.fn();

      renderWithClient(
        <ProductEditForm
          id={productsListFixture[0].id}
          onCanceled={onCancelMock}
        />
      );

      const saveButton = screen.findByRole('button', {
        name: /cancel/i,
      });

      await expect(saveButton).resolves.not.toBeDisabled();

      fireEvent.click(await saveButton);

      await waitFor(() => {
        expect(onCancelMock).toHaveBeenCalled();
      });
    });
  });
});
