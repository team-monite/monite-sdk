import { InvoiceDetails } from '@/components';
import { receivableListFixture } from '@/mocks/receivables';
import { renderWithClient, testQueryClient } from '@/utils/test-utils';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import {
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';

jest.mock('@/core/queries/useGetReceivableById', () => ({
  useGetReceivableById: jest.fn(),
}));
jest.mock('@/core/queries/useIsActionAllowed', () => ({
  useIsActionAllowed: jest.fn(),
}));


jest.mock('@/core/queries/usePermissions', () => ({
  useIsActionAllowed: jest.fn(),
}));

jest.mock('@/core/hooks', () => ({
  useComponentSettings: jest.fn(() => ({
    receivablesCallbacks: {
      onDelete: jest.fn(),
      onUpdate: jest.fn(),
      onInvoiceSent: jest.fn(),
    },
  })),
  useCurrencies: jest.fn(() => ({
    formatCurrencyToDisplay: jest.fn((amount, currency) => `${currency} ${amount}`),
  })),
  useIsLargeDesktopScreen: jest.fn(() => false),
}));

const mockUseGetReceivableById = jest.fn();
const mockUseIsActionAllowed = jest.fn();

describe('InvoiceDetails', () => {
  const defaultProps = {
    id: 'test-invoice-id',
    onClose: jest.fn(),
    onDuplicate: jest.fn(),
    onMarkAsUncollectible: jest.fn(),
  };

  const mockInvoice = receivableListFixture.invoice[0];

  beforeEach(() => {
    jest.clearAllMocks();
    testQueryClient.clear();
  });

  describe('Loading State', () => {
    it('should show loading spinner when invoice is loading', () => {
      mockUseGetReceivableById.mockReturnValue({
        data: undefined,
        isLoading: true,
      });
      mockUseIsActionAllowed.mockReturnValue({
        data: true,
        isLoading: false,
      });

      renderWithClient(<InvoiceDetails {...defaultProps} />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show loading spinner when permissions are loading', () => {
      mockUseGetReceivableById.mockReturnValue({
        data: mockInvoice,
        isLoading: false,
      });
      mockUseIsActionAllowed.mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      renderWithClient(<InvoiceDetails {...defaultProps} />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Access Restriction', () => {
    it('should show access restriction when user does not have read permission', () => {
      mockUseGetReceivableById.mockReturnValue({
        data: mockInvoice,
        isLoading: false,
      });
      mockUseIsActionAllowed.mockReturnValue({
        data: false,
        isLoading: false,
      });

      renderWithClient(<InvoiceDetails {...defaultProps} />);

      expect(screen.getByTestId('access-restriction')).toBeInTheDocument();
    });
  });

  describe('Not Found States', () => {
    it('should show not found when invoice does not exist', () => {
      mockUseGetReceivableById.mockReturnValue({
        data: null,
        isLoading: false,
      });
      mockUseIsActionAllowed.mockReturnValue({
        data: true,
        isLoading: false,
      });

      renderWithClient(<InvoiceDetails {...defaultProps} />);

      expect(screen.getByTestId('not-found')).toBeInTheDocument();
      expect(screen.getByText(t(i18n)`Invoice not found`)).toBeInTheDocument();
      expect(screen.getByText(t(i18n)`There is no invoice for the provided id: ${defaultProps.id}`)).toBeInTheDocument();
    });

    it('should show not found when receivable type is not invoice', () => {
      const nonInvoiceReceivable = { ...mockInvoice, type: 'quote' };
      mockUseGetReceivableById.mockReturnValue({
        data: nonInvoiceReceivable,
        isLoading: false,
      });
      mockUseIsActionAllowed.mockReturnValue({
        data: true,
        isLoading: false,
      });

      renderWithClient(<InvoiceDetails {...defaultProps} />);

      expect(screen.getByTestId('not-found')).toBeInTheDocument();
      expect(screen.getByText(t(i18n)`Receivable type not supported`)).toBeInTheDocument();
      expect(screen.getByText(t(i18n)`Receivable type quote is not supported. Only invoice is supported.`)).toBeInTheDocument();
    });
  });

  describe('Invoice Display', () => {
    beforeEach(() => {
      mockUseGetReceivableById.mockReturnValue({
        data: mockInvoice,
        isLoading: false,
      });
      mockUseIsActionAllowed.mockReturnValue({
        data: true,
        isLoading: false,
      });
    });

    it('should display invoice details when data is loaded', async () => {
      renderWithClient(<InvoiceDetails {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(t(i18n)`Invoice`)).toBeInTheDocument();
      });

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Payments')).toBeInTheDocument();
    });

    it('should display invoice amount and counterpart name', async () => {
      renderWithClient(<InvoiceDetails {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(t(i18n)`for ${mockInvoice.counterpart_name}`)).toBeInTheDocument();
      });
    });

    it('should show close button when invoice type is not invoice', async () => {
      const nonInvoiceReceivable = { ...mockInvoice, type: 'quote' };
      mockUseGetReceivableById.mockReturnValue({
        data: nonInvoiceReceivable,
        isLoading: false,
      });

      renderWithClient(<InvoiceDetails {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
      });
    });

    it('should not show close button for invoice type', async () => {
      renderWithClient(<InvoiceDetails {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    beforeEach(() => {
      mockUseGetReceivableById.mockReturnValue({
        data: mockInvoice,
        isLoading: false,
      });
      mockUseIsActionAllowed.mockReturnValue({
        data: true,
        isLoading: false,
      });
    });

    it('should show overview tab content by default', async () => {
      renderWithClient(<InvoiceDetails {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Overview')).toBeInTheDocument();
      });
    });

    it('should switch to details tab when clicked', async () => {
      renderWithClient(<InvoiceDetails {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Details')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Details'));
    });

    it('should switch to payments tab when clicked', async () => {
      renderWithClient(<InvoiceDetails {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Payments')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Payments'));
    });
  });

  describe('Action Handlers', () => {
    beforeEach(() => {
      mockUseGetReceivableById.mockReturnValue({
        data: mockInvoice,
        isLoading: false,
      });
      mockUseIsActionAllowed.mockReturnValue({
        data: true,
        isLoading: false,
      });
    });

    it('should call onDuplicate when duplicate button is clicked', async () => {
      renderWithClient(<InvoiceDetails {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Duplicate')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Duplicate'));

      expect(defaultProps.onDuplicate).toHaveBeenCalledWith(mockInvoice.id);
    });

    it('should call onMarkAsUncollectible when mark as uncollectible button is clicked', async () => {
      renderWithClient(<InvoiceDetails {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Mark as Uncollectible')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Mark as Uncollectible'));

      expect(defaultProps.onMarkAsUncollectible).toHaveBeenCalledWith(mockInvoice.id);
    });
  });

  describe('Props Handling', () => {
    beforeEach(() => {
      mockUseGetReceivableById.mockReturnValue({
        data: mockInvoice,
        isLoading: false,
      });
      mockUseIsActionAllowed.mockReturnValue({
        data: true,
        isLoading: false,
      });
    });

    it('should call onClose when close button is clicked', async () => {
      renderWithClient(<InvoiceDetails {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /x/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /x/i }));

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should not render when id is not provided', () => {
      renderWithClient(<InvoiceDetails {...defaultProps} id="" />);

      expect(screen.queryByText(t(i18n)`Invoice`)).not.toBeInTheDocument();
    });
  });
}); 