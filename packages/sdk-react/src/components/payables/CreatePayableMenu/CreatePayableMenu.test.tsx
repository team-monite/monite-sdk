import { renderWithClient } from '@/utils/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreatePayableMenu } from './CreatePayableMenu';
import { PayablesTabEnum } from '../types';

describe('CreatePayableMenu', () => {
  const defaultProps = {
    isCreateAllowed: true,
    onCreateInvoice: jest.fn(),
    onCreatePurchaseOrder: jest.fn(),
    handleFileUpload: jest.fn(),
    activeTab: PayablesTabEnum.Bills,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('# Button Caption', () => {
    it('should always show "Create new" as button text', () => {
      renderWithClient(<CreatePayableMenu {...defaultProps} />);
      expect(screen.getByRole('button', { name: /create new/i })).toBeInTheDocument();
    });

    it('should show same caption for Purchase Orders tab', () => {
      renderWithClient(
        <CreatePayableMenu {...defaultProps} activeTab={PayablesTabEnum.PurchaseOrders} />
      );
      expect(screen.getByRole('button', { name: /create new/i })).toBeInTheDocument();
    });
  });

  describe('# Tab Selection', () => {
    it('should select Bill tab when Bills table is active', async () => {
      const user = userEvent.setup();
      renderWithClient(<CreatePayableMenu {...defaultProps} />);
      
      await user.click(screen.getByRole('button', { name: /create new/i }));
    
      await waitFor(() => {
        const billTab = screen.getByRole('tab', { name: /bill/i });
        expect(billTab).toHaveAttribute('data-state', 'active');
      });
    });

    it('should select Purchase order tab when Purchase Orders table is active', async () => {
      const user = userEvent.setup();
      renderWithClient(
        <CreatePayableMenu {...defaultProps} activeTab={PayablesTabEnum.PurchaseOrders} />
      );
      
      await user.click(screen.getByRole('button', { name: /create new/i }));
      
      await waitFor(() => {
        const purchaseOrderTab = screen.getByRole('tab', { name: /purchase order/i });
        expect(purchaseOrderTab).toHaveAttribute('data-state', 'active');
      });
    });
  });

  describe('# Tab Content', () => {
    it('should show upload section in Bill tab', async () => {
      const user = userEvent.setup();
      renderWithClient(<CreatePayableMenu {...defaultProps} />);
      
      await user.click(screen.getByRole('button', { name: /create new/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/upload files/i)).toBeInTheDocument();
        expect(screen.getByText(/drag and drop files or click to upload/i)).toBeInTheDocument();
        expect(screen.getByText(/create new bill/i)).toBeInTheDocument();
      });
    });

    it('should show create manually section in Purchase order tab', async () => {
      const user = userEvent.setup();
      renderWithClient(<CreatePayableMenu {...defaultProps} />);
      
      await user.click(screen.getByRole('button', { name: /create new/i }));
      
      await user.click(screen.getByRole('tab', { name: /purchase order/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/create manually/i)).toBeInTheDocument();
        expect(screen.getByText(/create new purchase order/i)).toBeInTheDocument();
      });
    });
  });

  describe('# Actions', () => {
    it('should call onCreateInvoice when Create new bill is clicked', async () => {
      const user = userEvent.setup();
      const onCreateInvoice = jest.fn();
      renderWithClient(
        <CreatePayableMenu {...defaultProps} onCreateInvoice={onCreateInvoice} />
      );
      
      await user.click(screen.getByRole('button', { name: /create new/i }));
      await user.click(screen.getByText(/create new bill/i));
      
      expect(onCreateInvoice).toHaveBeenCalledTimes(1);
    });

    it('should call onCreatePurchaseOrder when Create new purchase order is clicked', async () => {
      const user = userEvent.setup();
      const onCreatePurchaseOrder = jest.fn();
      renderWithClient(
        <CreatePayableMenu {...defaultProps} onCreatePurchaseOrder={onCreatePurchaseOrder} />
      );
      
      await user.click(screen.getByRole('button', { name: /create new/i }));
      
      await user.click(screen.getByRole('tab', { name: /purchase order/i }));
      await user.click(screen.getByText(/create new purchase order/i));
      
      expect(onCreatePurchaseOrder).toHaveBeenCalledTimes(1);
    });
  });

  describe('# Tab Switching', () => {
    it('should allow switching between tabs', async () => {
      const user = userEvent.setup();
      renderWithClient(<CreatePayableMenu {...defaultProps} />);
      
      await user.click(screen.getByRole('button', { name: /create new/i }));
      
      expect(screen.getByRole('tab', { name: /bill/i })).toHaveAttribute('data-state', 'active');
      
      await user.click(screen.getByRole('tab', { name: /purchase order/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /purchase order/i })).toHaveAttribute('data-state', 'active');
        expect(screen.getByRole('tab', { name: /bill/i })).toHaveAttribute('data-state', 'inactive');
      });
    });
  });
});