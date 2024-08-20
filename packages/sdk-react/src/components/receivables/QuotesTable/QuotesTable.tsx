import { useMemo, useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  defaultCounterpartColumnWidth,
  useAutosizeGridColumns,
  useAreCounterpartsLoading,
} from '@/core/hooks/useAutosizeGridColumns';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useReceivables } from '@/core/queries/useReceivables';
import { ReceivableCursorFields } from '@/enums/ReceivableCursorFields';
import { CounterpartCell } from '@/ui/CounterpartCell';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { ReceivableFilters } from '../ReceivableFilters';
import { useReceivablesFilters } from '../ReceivableFilters/useReceivablesFilters';

export interface QuotesTableSortModel {
  field: components['schemas']['ReceivableCursorFields'];
  sort: NonNullable<GridSortDirection>;
}

type QuotesTableProps = {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;

  /**
   * The event handler for a sort change.
   *
   * @param {QuotesTableSortModel} params - The sort model.
   */
  onChangeSort?: (params: QuotesTableSortModel) => void;
};

export const QuotesTable = (props: QuotesTableProps) => (
  <MoniteScopedProviders>
    <QuotesTableBase {...props} />
  </MoniteScopedProviders>
);

const QuotesTableBase = ({
  onRowClick,
  onChangeSort: onChangeSortCallback,
}: QuotesTableProps) => {
  const { i18n } = useLingui();

  const [paginationToken, setPaginationToken] = useState<string | undefined>(
    undefined
  );

  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );

  const [sortModel, setSortModel] = useState<QuotesTableSortModel>({
    field: 'created_at',
    sort: 'desc',
  });

  const { formatCurrencyToDisplay } = useCurrencies();
  const { onChangeFilter, filters } = useReceivablesFilters();

  const { data: quotes, isLoading } = useReceivables({
    ...filters,
    sort: sortModel?.field,
    order: sortModel?.sort,
    limit: pageSize,
    pagination_token: paginationToken,
    type: 'quote',
  });

  const onChangeSort = (models: GridSortModel) => {
    const model = models[0] as QuotesTableSortModel;

    setSortModel(model);
    setPaginationToken(undefined);

    onChangeSortCallback?.(model);
  };

  const areCounterpartsLoading = useAreCounterpartsLoading(quotes?.data);

  const columns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'document_id',
        headerName: t(i18n)`Number`,
        width: 100,
      },
      {
        field: 'created_at',
        headerName: t(i18n)`Created on`,
        width: 140,
        valueFormatter: (value) =>
          value
            ? i18n.date(value, DateTimeFormatOptions.ShortMonthDateFormat)
            : '—',
      },
      {
        field: 'issue_date',
        headerName: t(i18n)`Issue Date`,
        width: 120,
        valueFormatter: (value) =>
          value && i18n.date(value, DateTimeFormatOptions.ShortMonthDateFormat),
      },
      {
        field: 'counterpart_name',
        sortable: ReceivableCursorFields.includes('counterpart_name'),
        headerName: t(i18n)`Customer`,
        width: defaultCounterpartColumnWidth,
        renderCell: (params) => (
          <CounterpartCell counterpartId={params.row.counterpart_id} />
        ),
      },
      {
        field: 'expiry_date',
        sortable: false,
        headerName: t(i18n)`Due date`,
        width: 120,
        valueFormatter: (value) =>
          value && i18n.date(value, DateTimeFormatOptions.ShortMonthDateFormat),
      },
      {
        field: 'status',
        sortable: ReceivableCursorFields.includes('status'),
        headerName: t(i18n)`Status`,
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

          return value ? formatCurrencyToDisplay(value, row.currency) : '';
        },
      },
    ];
  }, [formatCurrencyToDisplay, i18n]);

  const gridApiRef = useAutosizeGridColumns(
    quotes?.data,
    columns,
    areCounterpartsLoading
  );

  const className = 'Monite-QuotesTable';

  return (
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
        onSortModelChange={onChangeSort}
        sx={{
          '& .MuiDataGrid-withBorderColor': {
            borderColor: 'divider',
          },
          '&.MuiDataGrid-withBorderColor': {
            borderColor: 'divider',
          },
        }}
        onRowClick={(params) => onRowClick?.(params.row.id)}
        slots={{
          pagination: () => (
            <TablePagination
              nextPage={quotes?.next_pagination_token}
              prevPage={quotes?.prev_pagination_token}
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
        rows={quotes?.data || []}
      />
    </Box>
  );
};
