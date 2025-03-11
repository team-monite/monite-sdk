import { authenticationTokenFixture } from '@/mocks';
import { createEmailInvoiceDetailsHandlers } from '@/mocks/receivables';
import { server } from '@/mocks/server';
import { renderWithClient } from '@/utils/test-utils';
import { screen, waitFor } from '@testing-library/react';

import { EmailInvoiceDetails } from '../EmailInvoiceDetails';

jest.mock(
  '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/InvoicePreview',
  () => ({
    InvoicePreview: () => null,
  })
);

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

const mockOnClose = jest.fn();

const testSdkSettings = {
  entityId: 'test-entity-id',
  fetchToken: () => Promise.resolve(authenticationTokenFixture),
};

describe('EmailInvoiceDetails', () => {
  describe('Button text based on invoice status', () => {
    test('shows "Issue and Send" when invoice is in draft status', async () => {
      server.use(...createEmailInvoiceDetailsHandlers('draft'));

      renderWithClient(
        <EmailInvoiceDetails
          invoiceId="test-invoice-id"
          onClose={mockOnClose}
        />,
        testSdkSettings
      );

      await waitFor(() => {
        expect(screen.getByText(/Issue and Send/i)).toBeInTheDocument();
      });
    });

    test('shows "Send" when invoice is already issued', async () => {
      server.use(...createEmailInvoiceDetailsHandlers('issued'));

      renderWithClient(
        <EmailInvoiceDetails
          invoiceId="test-invoice-id"
          onClose={mockOnClose}
        />,
        testSdkSettings
      );

      await waitFor(() => {
        expect(screen.getByText(/Send/i)).toBeInTheDocument();
      });
    });

    test('shows "Send" when invoice is partially paid', async () => {
      server.use(...createEmailInvoiceDetailsHandlers('partially_paid'));

      renderWithClient(
        <EmailInvoiceDetails
          invoiceId="test-invoice-id"
          onClose={mockOnClose}
        />,
        testSdkSettings
      );

      await waitFor(() => {
        expect(screen.getByText(/Send/i)).toBeInTheDocument();
      });
    });
  });
});
