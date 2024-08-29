import { useMemo, useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  defaultCounterpartColumnWidth,
  useAreCounterpartsLoading,
  useAutosizeGridColumns,
} from '@/core/hooks/useAutosizeGridColumns';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useReceivables } from '@/core/queries/useReceivables';
import { ReceivableCursorFields } from '@/enums/ReceivableCursorFields';
import { CounterpartCellById } from '@/ui/CounterpartCell';
import { DataGridEmptyState } from '@/ui/DataGridEmptyState';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { useDateFormat } from '@/utils/MoniteOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { ReceivableFilters } from '../ReceivableFilters';
import { useReceivablesFilters } from '../ReceivableFilters/useReceivablesFilters';

type CreditNotesTableProps = {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;

  /**
   * The event handler for the creation new invoice for no data state
   *
   @param {boolean} isOpen - A boolean value indicating whether the dialog should be open (true) or closed (false).
   */
  setIsCreateInvoiceDialogOpen?: (isOpen: boolean) => void;
};

export interface CreditNotesTableSortModel {
  field: components['schemas']['ReceivableCursorFields'];
  sort: NonNullable<GridSortDirection>;
}

export const CreditNotesTable = (props: CreditNotesTableProps) => (
  <MoniteScopedProviders>
    <CreditNotesTableBase {...props} />
  </MoniteScopedProviders>
);

const CreditNotesTableBase = ({
  onRowClick,
  setIsCreateInvoiceDialogOpen,
}: CreditNotesTableProps) => {
  const { i18n } = useLingui();

  const [paginationToken, setPaginationToken] = useState<string | undefined>(
    undefined
  );

  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );

  const [sortModel, setSortModel] = useState<CreditNotesTableSortModel>({
    field: 'created_at',
    sort: 'desc',
  });

  const { formatCurrencyToDisplay } = useCurrencies();
  const { onChangeFilter, filters } = useReceivablesFilters();

  const {
    data: creditNotes,
    isLoading,
    isError,
    refetch,
  } = useReceivables({
    ...filters,
    sort: sortModel?.field,
    order: sortModel?.sort,
    limit: pageSize,
    pagination_token: paginationToken,
    type: 'credit_note',
  });

  const onChangeSort = (model: GridSortModel) => {
    setSortModel(model[0] as CreditNotesTableSortModel);
    setPaginationToken(undefined);
  };

  const areCounterpartsLoading = useAreCounterpartsLoading(creditNotes?.data);
  const dateFormat = useDateFormat();

  const columns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'document_id',
        headerName: t(i18n)`Number`,
        width: 100,
        renderCell: ({ value }) => {
          if (!value) {
            return t(i18n)`INV-auto`;
          }

          return <span className="Monite-TextOverflowContainer">{value}</span>;
        },
      },
      {
        field: 'created_at',
        headerName: t(i18n)`Created on`,
        width: 140,
        valueFormatter: (value) => (value ? i18n.date(value, dateFormat) : '—'),
      },
      {
        field: 'issue_date',
        headerName: t(i18n)`Issue date`,
        width: 120,
        valueFormatter: (value) => value && i18n.date(value, dateFormat),
      },
      {
        field: 'counterpart_name',
        headerName: t(i18n)`Customer`,
        sortable: ReceivableCursorFields.includes('counterpart_name'),
        width: defaultCounterpartColumnWidth,
        renderCell: (params) => (
          <CounterpartCellById counterpartId={params.row.counterpart_id} />
        ),
      },
      {
        field: 'status',
        headerName: t(i18n)`Status`,
        sortable: ReceivableCursorFields.includes('status'),
        width: 80,
        renderCell: (params) => {
          const status = params.value;
          return <InvoiceStatusChip status={status} />;
        },
      },
      {
        field: 'amount',
        headerName: t(i18n)`Amount`,
        sortable: ReceivableCursorFields.includes('amount'),
        width: 120,
        valueGetter: (_, row) => {
          const value = row.total_amount;

          return value && formatCurrencyToDisplay(value, row.currency);
        },
      },
    ];
  }, [dateFormat, formatCurrencyToDisplay, i18n]);

  const gridApiRef = useAutosizeGridColumns(
    creditNotes?.data,
    columns,
    areCounterpartsLoading,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    'CreditNotesTable'
  );

  if (!isLoading && !creditNotes?.data.length) {
    return (
      <DataGridEmptyState
        title={t(i18n)`No Credit Notes`}
        descriptionLine1={t(i18n)`You don’t have any credit notes yet.`}
        descriptionLine2={t(i18n)`You can create your first credit note.`}
        actionButtonLabel={t(i18n)`Create Invoice`}
        actionOptions={[t(i18n)`Invoice`]}
        onAction={(action) => {
          if (action === t(i18n)`Invoice`) {
            setIsCreateInvoiceDialogOpen?.(true);
          }
        }}
        type="no-data"
      />
    );
  }

  if (isError) {
    return (
      <DataGridEmptyState
        title={t(i18n)`Failed to Load Credit Notes`}
        descriptionLine1={t(i18n)`There was an error loading credit notes.`}
        descriptionLine2={t(i18n)`Please try again later.`}
        actionButtonLabel={t(i18n)`Reload`}
        onAction={() => refetch()}
        type="error"
      />
    );
  }

  const className = 'Monite-CreditNotesTable';

  return (
    <>
      <Box
        className={classNames(ScopedCssBaselineContainerClassName, className)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: 'inherit',
          pt: 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <ReceivableFilters
            onChange={onChangeFilter}
            filters={['document_id__contains', 'status', 'counterpart_id']}
          />
        </Box>
        <DataGrid
          initialState={{
            sorting: {
              sortModel: [sortModel],
            },
          }}
          apiRef={gridApiRef}
          rowSelection={false}
          disableColumnFilter={true}
          loading={isLoading}
          sx={{
            '& .MuiDataGrid-withBorderColor': {
              borderColor: 'divider',
            },
            '&.MuiDataGrid-withBorderColor': {
              borderColor: 'divider',
            },
          }}
          onSortModelChange={onChangeSort}
          onRowClick={(params) => onRowClick?.(params.row.id)}
          slots={{
            pagination: () => (
              <TablePagination
                nextPage={creditNotes?.next_pagination_token}
                prevPage={creditNotes?.prev_pagination_token}
                paginationModel={{
                  pageSize,
                  page: paginationToken,
                }}
                onPaginationModelChange={({ page, pageSize }) => {
                  setPageSize(pageSize);
                  setPaginationToken(page ?? undefined);
                }}
              />
            ),
          }}
          columns={columns}
          rows={creditNotes?.data ?? []}
        />
      </Box>
    </>
  );
};
