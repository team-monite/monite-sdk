import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { render, screen, fireEvent } from '@testing-library/react';

import { ConfirmationModal } from './ConfirmationModal';

// Mock the useRootElements hook
jest.mock('@/core/context/RootElementsProvider', () => ({
  useRootElements: () => ({
    root: document.body,
  }),
}));

describe('ConfirmationModal', () => {
  const defaultProps = {
    open: true,
    title: 'Test Title',
    message: 'Test Message',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(
      <I18nProvider i18n={i18n}>
        <ConfirmationModal {...defaultProps} {...props} />
      </I18nProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dialog with correct content when open', () => {
    renderComponent();

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('does not render dialog when closed', () => {
    renderComponent({ open: false });

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Confirm'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside the dialog', () => {
    renderComponent();

    // Simulate clicking outside by clicking on the backdrop
    const backdrop = screen.getByRole('presentation');
    fireEvent.click(backdrop);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when pressing Escape key', () => {
    renderComponent();

    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  describe('loading state', () => {
    it('disables both buttons when isLoading is true', () => {
      renderComponent({ isLoading: true });

      const confirmButton = screen.getByText('Confirm');
      const cancelButton = screen.getByText('Cancel');

      expect(confirmButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it('shows loading spinner on confirm button when isLoading is true', () => {
      renderComponent({ isLoading: true });

      const confirmButton = screen.getByText('Confirm');
      expect(confirmButton.querySelector('svg')).toBeInTheDocument();
    });

    it('does not trigger onConfirm when confirm button is clicked in loading state', () => {
      renderComponent({ isLoading: true });

      fireEvent.click(screen.getByText('Confirm'));
      expect(defaultProps.onConfirm).not.toHaveBeenCalled();
    });

    it('does not trigger onClose when cancel button is clicked in loading state', () => {
      renderComponent({ isLoading: true });

      fireEvent.click(screen.getByText('Cancel'));
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });
});
