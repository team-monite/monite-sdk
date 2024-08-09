import { InvoicesTable } from '@/components';
import { receivableListFixture } from '@/mocks/receivables';
import { renderWithClient } from '@/utils/test-utils';
import { findByLabelText, fireEvent, screen } from '@testing-library/react';

describe('InvoicesTable', () => {
  test('renders action menu if onRowAction property specified', async () => {
    const onClick = jest.fn();

    renderWithClient(<InvoicesTable onRowActionClick={onClick} />);

    await expect(
      screen.findByRole('columnheader', { name: 'Action menu' })
    ).resolves.toBeInTheDocument();
  });

  test('renders action menu default items', async () => {
    renderWithClient(<InvoicesTable onRowActionClick={jest.fn()} />);

    const draftCellNodes = screen.findAllByRole('gridcell', {
      name: 'INV-auto',
    });

    await expect(draftCellNodes).resolves.toBeInstanceOf(Array);
    const [invoiceCellNode] = await draftCellNodes;
    expect(invoiceCellNode).toBeInTheDocument();

    const invoiceRowNode = invoiceCellNode.closest('[role="row"]');
    expect(invoiceRowNode).toBeInTheDocument();

    const invoiceActionMenuButton = findByLabelText(
      invoiceRowNode as HTMLElement,
      'more'
    );
    await expect(invoiceActionMenuButton).resolves.toBeInTheDocument();
    fireEvent.click(await invoiceActionMenuButton);

    await expect(
      screen.findByRole('menuitem', { name: 'View' })
    ).resolves.toBeInTheDocument();

    expect(
      screen.queryByRole('menuitem', { name: 'Recurring' })
    ).not.toBeInTheDocument();
  }, 10_000);

  test('renders action menu custom items', async () => {
    const onRowActionClick = jest.fn();

    renderWithClient(
      <InvoicesTable
        onRowActionClick={onRowActionClick}
        rowActions={{ draft: ['recurrent'] }}
      />
    );

    const draftCellNodes = screen.findAllByRole('gridcell', {
      name: 'INV-auto',
    });

    await expect(draftCellNodes).resolves.toBeInstanceOf(Array);
    const [invoiceCellNode] = await draftCellNodes;
    expect(invoiceCellNode).toBeInTheDocument();

    const invoiceRowNode = invoiceCellNode.closest('[role="row"]');
    expect(invoiceRowNode).toBeInTheDocument();

    const invoiceActionMenuButton = findByLabelText(
      invoiceRowNode as HTMLElement,
      'more'
    );
    await expect(invoiceActionMenuButton).resolves.toBeInTheDocument();
    fireEvent.click(await invoiceActionMenuButton);

    await expect(
      screen.findByRole('menuitem', { name: 'Recurring' })
    ).resolves.toBeInTheDocument();

    expect(
      screen.queryByRole('menuitem', { name: 'View' })
    ).not.toBeInTheDocument();

    fireEvent.click(await screen.findByRole('menuitem', { name: 'Recurring' }));

    const firstDraftInvoiceId = invoiceRowNode?.getAttribute('data-id');

    expect(onRowActionClick.mock.calls).toEqual([
      [{ id: firstDraftInvoiceId, action: 'recurrent' }],
    ]);
  }, 10_000);

  test('not renders action menu if onRowAction property is not specified', async () => {
    renderWithClient(<InvoicesTable />);

    const firstInvoiceNotEmptyDocumentId = receivableListFixture.invoice.find(
      ({ document_id }) => document_id
    )?.document_id;

    expect(firstInvoiceNotEmptyDocumentId).toBeDefined();

    await expect(
      screen.findAllByRole('gridcell', {
        name: String(firstInvoiceNotEmptyDocumentId),
      })
    ).resolves.toBeInstanceOf(Array);

    expect(
      screen.queryByRole('columnheader', { name: 'Action menu' })
    ).not.toBeInTheDocument();
  });
});
