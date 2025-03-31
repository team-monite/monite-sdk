import { renderWithClient } from '@/utils/test-utils';
import { fireEvent, screen } from '@testing-library/react';

import { ReceivablesTable } from './ReceivablesTable';

describe('ReceivablesTable', () => {
  test('renders "Invoices" tab by default', async () => {
    renderWithClient(<ReceivablesTable />);
    const invoicesTab = screen.findByRole('tab', { name: 'Invoices' });

    await expect(invoicesTab).resolves.toHaveAttribute('aria-selected', 'true');

    const documents = await screen.findAllByText(/INV-/);

    expect(documents[0]).toBeInTheDocument();
  });

  test('renders the list of "Quotes" if tab specified', async () => {
    renderWithClient(<ReceivablesTable tab={1} onTabChange={jest.fn()} />);

    await expect(
      screen.findByRole('tab', { name: 'Quotes' })
    ).resolves.toHaveAttribute('aria-selected', 'true');

    const documents = await screen.findAllByText(/quote-/);

    expect(documents[0]).toBeInTheDocument();
  });

  test('renders "Quotes" tab panel when click on tab "Quotes"', async () => {
    renderWithClient(<ReceivablesTable />);

    const quotesTab = screen.findByRole('tab', { name: 'Quotes' });

    fireEvent.click(await quotesTab);

    await expect(quotesTab).resolves.toHaveAttribute('aria-selected', 'true');

    const documents = await screen.findAllByText(/quote--/);

    expect(documents[0]).toBeInTheDocument();
  });

  test('renders the list of "Credit notes" if tab specified', async () => {
    renderWithClient(<ReceivablesTable tab={2} onTabChange={jest.fn()} />);

    await expect(
      screen.findByRole('tab', { name: 'Credit notes' })
    ).resolves.toHaveAttribute('aria-selected', 'true');

    const documents = await screen.findAllByText(/credit_note--/);

    expect(documents[0]).toBeInTheDocument();
  });
});
