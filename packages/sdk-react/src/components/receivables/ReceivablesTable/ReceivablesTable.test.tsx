import React from 'react';

import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { fireEvent, screen } from '@testing-library/react';

import { ReceivablesTable, ReceivablesTableTabEnum } from './ReceivablesTable';

describe('ReceivablesTable', () => {
  test('should render the list of invoices by default', async () => {
    renderWithClient(<ReceivablesTable />);

    await waitUntilTableIsLoaded();

    expect(screen.getAllByText(/INV-/)[0]).toBeInTheDocument();
  });

  test('should render the list of quotes by default when the customer provides it', async () => {
    renderWithClient(
      <ReceivablesTable
        tab={ReceivablesTableTabEnum.Quotes}
        onTabChange={jest.fn()}
      />
    );

    await waitUntilTableIsLoaded();

    expect(screen.getAllByText(/quote-/)[0]).toBeInTheDocument();
  });

  test('should render the list of invoices when click on tab "Invoices"', async () => {
    renderWithClient(<ReceivablesTable />);

    const invoicesTab = screen.getByText('Invoices');
    fireEvent.click(invoicesTab);

    await waitUntilTableIsLoaded();

    expect(screen.getAllByText(/INV-/)[0]).toBeInTheDocument();
  });

  test('should render the list of quotes when click on tab "Quotes"', async () => {
    renderWithClient(<ReceivablesTable />);

    const quotesTab = screen.getByText('Quotes');
    fireEvent.click(quotesTab);

    await waitUntilTableIsLoaded();

    expect(screen.getAllByText(/quote--/)[0]).toBeInTheDocument();
  });

  test('should render the list of credit notes when click on tab "Credit notes"', async () => {
    renderWithClient(<ReceivablesTable />);

    const creditNotesTab = screen.getByText('Credit notes');
    fireEvent.click(creditNotesTab);

    await waitUntilTableIsLoaded();

    expect(screen.getAllByText(/credit_note--/)[0]).toBeInTheDocument();
  });
});
