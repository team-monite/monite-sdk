import i18n from '@/mocks/i18n';
import { renderWithClient } from '@/utils/test-utils';
import { I18nProvider } from '@lingui/react';
import { screen, fireEvent } from '@testing-library/react';

import { describe, it, beforeEach, expect, vi } from 'vitest';

import { ConfirmationModal } from './ConfirmationModal';

describe('ConfirmationModal', () => {
  const defaultProps = {
    open: true,
    title: 'Test Title',
    message: 'Test Message',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  };

  const renderComponent = (props = {}) => {
    return renderWithClient(
      <I18nProvider i18n={i18n}>
        <ConfirmationModal {...defaultProps} {...props} />
      </I18nProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
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

  it.skip('calls onClose when clicking outside the dialog', () => {
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
    it.skip('disables both buttons when isLoading is true', () => {
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

    it.skip('does not trigger onClose when cancel button is clicked in loading state', () => {
      renderComponent({ isLoading: true });

      fireEvent.click(screen.getByText('Cancel'));
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('children prop', () => {
    it('renders children content instead of message when provided', () => {
      const children = <div data-testid="custom-content">Custom Content</div>;
      renderComponent({ children, message: undefined });

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
    });

    it.skip('renders both message and children when both are provided', () => {
      const children = <div data-testid="custom-content">Custom Content</div>;
      renderComponent({ children });

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Test Message')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it.skip('has correct ARIA attributes', () => {
      renderComponent();

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Confirmation dialog');
    });

    it.skip('maintains focus trap within the dialog', () => {
      renderComponent();

      const dialog = screen.getByRole('dialog');
      const confirmButton = screen.getByText('Confirm');
      const cancelButton = screen.getByText('Cancel');

      // Focus should start on cancel button (autoFocus)
      expect(cancelButton).toHaveFocus();

      // Tab should move focus to confirm button
      fireEvent.keyDown(dialog, { key: 'Tab' });
      expect(confirmButton).toHaveFocus();

      // Tab should move focus back to cancel button
      fireEvent.keyDown(dialog, { key: 'Tab' });
      expect(cancelButton).toHaveFocus();
    });
  });

  describe('styling', () => {
    it('applies correct styles to dialog title', () => {
      renderComponent();

      const title = screen.getByText('Test Title');
      expect(title).toHaveStyle({
        padding: '2rem 2rem 1.5rem',
      });
    });

    it.skip('applies correct styles to dialog content', () => {
      renderComponent();

      const content = screen.getByText('Test Message').parentElement;
      expect(content).toHaveStyle({
        padding: '1rem 2rem',
      });
    });

    it('applies correct styles to dialog actions', () => {
      renderComponent();

      const actions = screen
        .getByText('Confirm')
        .closest('div[class*="MuiDialogActions"]');
      expect(actions).toHaveStyle({
        padding: '1.7rem 2rem',
      });
    });
  });
});
