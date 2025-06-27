import { VirtuosoMockContext } from 'react-virtuoso';

import { RootElementsProvider } from '@/core/context/RootElementsProvider';
import { receivableListFixture } from '@/mocks';
import { entityIds } from '@/mocks/entities';
import { Dialog } from '@/ui/Dialog';
import { renderWithClient } from '@/utils/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EmailInvoiceDetails } from './EmailInvoiceDetails';

const mockInvoice = receivableListFixture.invoice[1];
const mockInvoiceId = mockInvoice.id;

const moniteSettings = {
  entityId: entityIds[0],
  fetchToken: () =>
    Promise.resolve({
      access_token: 'token',
      token_type: 'Bearer',
      expires_in: 3600,
    }),
};

const renderEmailInvoiceDetails = (props = {}) => {
  return renderWithClient(
    <VirtuosoMockContext.Provider
      value={{ viewportHeight: 300, itemHeight: 50 }}
    >
      <RootElementsProvider>
        <Dialog open={true}>
          <EmailInvoiceDetails
            invoiceId={mockInvoiceId}
            onClose={jest.fn()}
            {...props}
          />
        </Dialog>
      </RootElementsProvider>
    </VirtuosoMockContext.Provider>,
    moniteSettings
  );
};

describe('EmailInvoiceDetails', () => {
  test('should pre-populate email details with values', async () => {
    renderEmailInvoiceDetails();

    await waitFor(() => {
      expect(screen.getByTestId('subject-input')).not.toHaveValue('');
      expect(screen.getByTestId('body-input')).not.toHaveValue('');
      expect(screen.getByTestId('to-select')).toHaveTextContent(/.+/);
    });
  });

  test('should show issue and send button in compose view', async () => {
    renderEmailInvoiceDetails();

    const button = await screen.findByTestId('issue-and-send-button');

    await waitFor(() => {
      expect(button).toBeEnabled();
      expect(button).toHaveTextContent(/./);
    });
  });

  test('should handle issue and send flow in compose view', async () => {
    const onClose = jest.fn();
    renderEmailInvoiceDetails({ onClose });

    const button = await screen.findByTestId('issue-and-send-button');

    await waitFor(() => {
      expect(button).toBeEnabled();
    });

    await userEvent.click(button);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  test('should handle preview and issue-send flow', async () => {
    const onClose = jest.fn();
    renderEmailInvoiceDetails({ onClose });

    const previewButton = await screen.findByTestId('preview-button');
    await waitFor(() => {
      expect(previewButton).toBeEnabled();
    });
    await userEvent.click(previewButton);

    const issueAndSendButton = await screen.findByTestId(
      'issue-and-send-button'
    );
    await waitFor(() => {
      expect(issueAndSendButton).toBeEnabled();
    });
    await userEvent.click(issueAndSendButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
