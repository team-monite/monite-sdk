import { renderWithClient } from '@/utils/test-utils';
import { screen, fireEvent } from '@testing-library/react';

import { Dialog } from '../../components/Dialog/Dialog';
import { FullScreenModalHeader } from './FullScreenModalHeader';

describe('FullScreenModalHeader Component', () => {
  const renderInDialog = (ui: React.ReactElement) => {
    return renderWithClient(
      <Dialog open={true} fullScreen={true}>
        {ui}
      </Dialog>
    );
  };

  test('renders with required props', () => {
    renderInDialog(<FullScreenModalHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('renders with optional status element', () => {
    renderInDialog(
      <FullScreenModalHeader
        title="Test Title"
        statusElement={<div data-testid="status">Status</div>}
      />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('status')).toBeInTheDocument();
  });

  test('renders with optional actions', () => {
    renderInDialog(
      <FullScreenModalHeader
        title="Test Title"
        actions={<button data-testid="action">Action</button>}
      />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('action')).toBeInTheDocument();
  });

  test('renders with custom close button tooltip', () => {
    renderInDialog(
      <FullScreenModalHeader
        title="Test Title"
        closeButtonTooltip="Custom close tooltip"
      />
    );
    const closeButton = screen.getByLabelText('Custom close tooltip');
    expect(closeButton).toBeInTheDocument();
  });

  test('throws error when not used in fullscreen dialog', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      renderWithClient(
        <Dialog open={true} fullScreen={false}>
          <FullScreenModalHeader title="Test Title" />
        </Dialog>
      );
    }).toThrow(
      'FullScreenModalHeader should only be used in fullscreen dialogs'
    );

    consoleError.mockRestore();
  });

  test('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    renderWithClient(
      <Dialog open={true} fullScreen={true} onClose={onClose}>
        <FullScreenModalHeader title="Test Title" />
      </Dialog>
    );

    const closeButton = screen.getByLabelText('Close dialog');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
