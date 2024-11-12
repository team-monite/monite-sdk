import { useMemo, useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { ReceivableFilters } from '@/components/receivables/ReceivableFilters/ReceivableFilters';
import {
  ReceivableFilterType,
  ReceivablesTabFilter,
} from '@/components/receivables/ReceivablesTable/types';
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
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
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

  /**
   * The query to be used for the Table
   */
  query?: ReceivablesTabFilter;

  /** Filters to be applied to the table */
  filters?: Array<keyof ReceivableFilterType>;
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
  query,
  filters: filtersProp,
}: CreditNotesTableProps) => {
  const { i18n } = useLingui();

  const [paginationToken, setPaginationToken] = useState<string | undefined>(
    undefined
  );

  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );

  const [sortModel, setSortModel] = useState<CreditNotesTableSortModel>({
    field: query?.sort ?? 'created_at',
    sort: query?.order ?? 'desc',
  });

  const { formatCurrencyToDisplay } = useCurrencies();
  const { onChangeFilter, filters, filtersQuery } = useReceivablesFilters(
    (['document_id__contains', 'status', 'counterpart_id'] as const).filter(
      (filter) => filtersProp?.includes(filter) ?? true
    ),
    query
  );

  const {
    data: creditNotes,
    isLoading,
    isError,
    refetch,
  } = useReceivables({
    ...filtersQuery,
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
        display: 'flex',
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
        headerAlign: 'right',
        align: 'right',
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

  const isFiltering = Object.keys(filters).some(
    (key) =>
      filters[key as keyof typeof filters] !== null &&
      filters[key as keyof typeof filters] !== undefined
  );

  const isSearching =
    !!filters['document_id__contains' as keyof typeof filters];

  if (
    !isLoading &&
    creditNotes?.data.length === 0 &&
    !isFiltering &&
    !isSearching
  ) {
    return (
      <DataGridEmptyState
        title={t(i18n)`No Credit Notes`}
        descriptionLine1={t(i18n)`You don’t have any credit notes yet.`}
        descriptionLine2={t(i18n)`You can create your first credit note.`}
        actionButtonLabel={t(i18n)`Create Credit Note`}
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
          <ReceivableFilters onChange={onChangeFilter} filters={filters} />
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
            noRowsOverlay: () => (
              <GetNoRowsOverlay
                isLoading={isLoading}
                dataLength={creditNotes?.data.length || 0}
                isFiltering={isFiltering}
                isSearching={isSearching}
                isError={isError}
                onCreate={() => setIsCreateInvoiceDialogOpen?.(true)}
                refetch={refetch}
                entityName={t(i18n)`Credit Notes`}
                actionButtonLabel={t(i18n)`Create Credit Note`}
                actionOptions={[t(i18n)`Invoice`]}
                type="no-data"
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
