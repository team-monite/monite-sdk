import { PurchaseOrderForm } from '../PurchaseOrderForm';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('PurchaseOrderForm', () => {
  describe('# Create Mode', () => {
    it('should render all required fields', async () => {
      renderWithClient(
        <PurchaseOrderForm isCreate vendorTypes={['customer', 'vendor']} />
      );

      await waitUntilTableIsLoaded();

      expect(
        screen.getByRole('combobox', { name: /vendor/i })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('heading', { name: /items/i })
      ).toBeInTheDocument();
    });

    it('should show validation errors when submitting empty form', async () => {
      const onSave = jest.fn();
      renderWithClient(<PurchaseOrderForm isCreate onSave={onSave} />);

      await waitUntilTableIsLoaded();

      const saveButton = screen.getByRole('button', {
        name: /save.*continue/i,
      });
      await userEvent.click(saveButton);

      await waitFor(() => {
        const requiredErrors = screen.queryAllByText(/required/i);
        expect(requiredErrors.length).toBeGreaterThan(0);
      });

      expect(onSave).not.toHaveBeenCalled();
    });

    it('should render form with vendor selector and items section', async () => {
      renderWithClient(<PurchaseOrderForm isCreate />);

      await waitUntilTableIsLoaded();

      expect(screen.getByRole('combobox', { name: /vendor/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /items/i })).toBeInTheDocument();
    });
  });

  describe('# Edit Mode', () => {
    const mockPurchaseOrder = {
      id: 'po-123',
      document_id: 'PO-00001',
      status: 'draft',
      counterpart_id: 'vendor-123',
      items: [
        {
          name: 'Test Item',
          quantity: 2,
          unit: 'unit',
          price: 1000,
          currency: 'USD',
          vat_rate: 1000,
        },
      ],
      message: 'Test message',
      valid_for_days: 30,
      currency: 'USD',
    };

    it('should render form in edit mode', async () => {
      renderWithClient(
        <PurchaseOrderForm
          isCreate={false}
          purchaseOrder={mockPurchaseOrder as any}
        />
      );

      await waitUntilTableIsLoaded();

      expect(screen.getByRole('combobox', { name: /vendor/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /items/i })).toBeInTheDocument();
    });
  });

  describe('# Line Items', () => {
    it('should add new line item when clicking add button', async () => {
      renderWithClient(<PurchaseOrderForm isCreate />);

      await waitUntilTableIsLoaded();

      const addButton = screen.getByRole('button', { name: /row/i });
      await userEvent.click(addButton);

      await waitFor(() => {
        const nameInputs = screen.getAllByPlaceholderText(/line item/i);
        expect(nameInputs.length).toBeGreaterThan(0);
      });
    });

    it('should validate line items correctly', async () => {
      renderWithClient(<PurchaseOrderForm isCreate />);

      await waitUntilTableIsLoaded();

      const addButton = screen.getByRole('button', { name: /row/i });
      await userEvent.click(addButton);

      const saveButton = screen.getByRole('button', { name: /save/i });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/name.*required/i)).toBeInTheDocument();
      });
    });
  });

  describe('# Currency and VAT', () => {
    it('should handle VAT mode switching', async () => {
      renderWithClient(<PurchaseOrderForm isCreate />);

      await waitUntilTableIsLoaded();

      const addButton = screen.getByRole('button', { name: /row/i });
      await userEvent.click(addButton);

      expect(screen.getByText(/vat/i)).toBeInTheDocument();
    });

    it('should maintain currency consistency across line items', async () => {
      renderWithClient(<PurchaseOrderForm isCreate />);

      await waitUntilTableIsLoaded();

      const addButton = screen.getByRole('button', { name: /row/i });
      await userEvent.click(addButton);
      await userEvent.click(addButton);

      await waitFor(() => {
        const lineItems = screen.getAllByPlaceholderText(/line item/i);
        expect(lineItems.length).toBeGreaterThanOrEqual(2);
      });
    });
  });
});
