import { CREATE_INVOICE } from '@/components/receivables/consts';
import { receivableListFixture } from '@/mocks/receivables';
import { DataGridEmptyState } from '@/ui/DataGridEmptyState';
import { renderWithClient } from '@/utils/test-utils';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import {
  findByLabelText,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import { describe, test, expect, vi } from 'vitest';

import { InvoicesTable } from './InvoicesTable';

describe('InvoicesTable', () => {
  test.skip('renders action menu if onRowAction property specified', async () => {
    const onClick = vi.fn();

    renderWithClient(<InvoicesTable onRowActionClick={onClick} />);

    await expect(
      screen.findByRole('columnheader', { name: 'Action menu' })
    ).resolves.toBeInTheDocument();
  });

  test.skip('renders action menu default items', async () => {
    renderWithClient(<InvoicesTable onRowActionClick={vi.fn()} />);

    const draftCellNodes = screen.findAllByRole('gridcell', {
      name: new RegExp(CREATE_INVOICE),
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

  test.skip('renders action menu custom items', async () => {
    const onRowActionClick = vi.fn();

    renderWithClient(
      <InvoicesTable
        onRowActionClick={onRowActionClick}
        rowActions={{ draft: ['recurrent'] }}
      />
    );

    const draftCellNodes = screen.findAllByRole('gridcell', {
      name: new RegExp(CREATE_INVOICE),
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

  test.skip('not renders action menu if onRowAction property is not specified', async () => {
    renderWithClient(<InvoicesTable />);

    const firstInvoiceNotEmptyDocumentId = receivableListFixture.invoice.find(
      ({ document_id }) => document_id
    )?.document_id;

    expect(firstInvoiceNotEmptyDocumentId).toBeDefined();

    await expect(
      screen.findAllByRole('gridcell', {
        name: new RegExp(String(firstInvoiceNotEmptyDocumentId)),
      })
    ).resolves.toBeInstanceOf(Array);

    expect(
      screen.queryByRole('columnheader', { name: 'Action menu' })
    ).not.toBeInTheDocument();
  });

  describe('DataGridEmptyState', () => {
    test('renders with correct title and descriptions', () => {
      render(
        <DataGridEmptyState
          title={t(i18n)`No Receivables`}
          descriptionLine1={t(i18n)`You don’t have any roles yet.`}
          descriptionLine2={t(i18n)`You can create your first invoice.`}
          actionButtonLabel={t(i18n)`Create Invoice`}
          onAction={() => {}}
          type="no-data"
        />
      );

      expect(screen.getByText('No Receivables')).toBeInTheDocument();
      expect(
        screen.getByText('You don’t have any roles yet.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('You can create your first invoice.')
      ).toBeInTheDocument();
      expect(screen.getByText('Create Invoice')).toBeInTheDocument();
    });
  });
});
