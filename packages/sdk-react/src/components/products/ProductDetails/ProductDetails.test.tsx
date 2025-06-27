import { vi } from 'vitest';
import { ENTITY_ID_FOR_EMPTY_PERMISSIONS } from '@/mocks/entityUsers';
import { productsListFixture } from '@/mocks/products';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { ExistingProductDetails } from './ExistingProductDetails';

describe.skip('Product Details', () => {
  test('should render product details when user has full permissions', async () => {
    renderWithClient(<ExistingProductDetails id={productsListFixture[0].id} />);

    await waitUntilTableIsLoaded();

    expect(
      screen.getByRole('heading', { name: productsListFixture[0].name })
    ).toBeInTheDocument();
  });

  test('should render "Access Restricted" message when user does not have access to products', async () => {
    const monite = {
      entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
      fetchToken: () =>
        Promise.resolve({
          access_token: 'token',
          token_type: 'Bearer',
          expires_in: 10_000,
        }),
    };

    renderWithClient(
      <ExistingProductDetails id={productsListFixture[0].id} />,
      monite
    );

    await waitUntilTableIsLoaded();

    expect(await screen.findByText(/Access Restricted/)).toBeInTheDocument();
  });

  test('should render "Not Found" message component if the product is not found', async () => {
    renderWithClient(<ExistingProductDetails id="not-found-id" />);

    await waitUntilTableIsLoaded();

    expect(await screen.findByText(/Product not found/)).toBeInTheDocument();
  });

  describe('#Actions', () => {
    test('should trigger "onDelete" callback with product when we click on "delete" button in details', async () => {
      const onDeleteMock = vi.fn();

      renderWithClient(
        <ExistingProductDetails
          id={productsListFixture[0].id}
          onDeleted={onDeleteMock}
        />
      );

      await waitUntilTableIsLoaded();

      const deleteButton = screen.getByRole('button', {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      const innerDeleteButton = await screen.findByRole('button', {
        name: /delete/i,
      });
      fireEvent.click(innerDeleteButton);

      await waitFor(() => {
        expect(onDeleteMock).toHaveBeenCalledWith(productsListFixture[0].id);
      });
    });
  });
});
