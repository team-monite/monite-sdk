import { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { InvoiceCounterpartName } from '@/components/receivables/InvoiceCounterpartName';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useReceivables } from '@/core/queries/useReceivables';
import { ReceivableCursorFields } from '@/enums/ReceivableCursorFields';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';
import { DataGrid, GridSortModel, useGridApiRef } from '@mui/x-data-grid';
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

  // Adapted from https://mui.com/x/react-data-grid/column-dimensions/#autosizing-asynchronously
  // setTimeout and flushSync are necessary for call order control
  // Docs say:
  // The Data Grid can only autosize based on the currently rendered cells.
  // DOM access is required to accurately calculate dimensions
  const gridApiRef = useGridApiRef();
  useEffect(() => {
    setTimeout(() => {
      ReactDOM.flushSync(() => {
        setTimeout(() => {
          if (gridApiRef.current?.autosizeColumns) {
            // noinspection JSIgnoredPromiseFromCall
            gridApiRef.current?.autosizeColumns({
              columns: ['amount'],
              includeHeaders: true,
              includeOutliers: true,
            });
          }
        }, 1);
      });
    }, 1);
  }, [gridApiRef, quotes]);

  const className = 'Monite-QuotesTable';

  return (
    <>
      <Box
        sx={{ padding: 2, width: '100%' }}
        className={classNames(ScopedCssBaselineContainerClassName, className)}
      >
        <Box sx={{ marginBottom: 2 }}>
          <ReceivableFilters
            onChange={onChangeFilter}
            filters={['document_id__contains', 'status', 'counterpart_id']}
          />
        </Box>
        <DataGrid
          apiRef={gridApiRef}
          rowSelection={false}
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
          columns={[
            {
              field: 'document_id',
              sortable: false,
              headerName: t(i18n)`Number`,
              flex: 1.2,
            },
            {
              field: 'created_at',
              sortable: false,
              headerName: t(i18n)`Created on`,
              valueFormatter: (value) =>
                value
                  ? i18n.date(value, DateTimeFormatOptions.EightDigitDate)
                  : '—',
              flex: 1,
            },
            {
              field: 'issue_date',
              sortable: false,
              headerName: t(i18n)`Issue Date`,
              valueFormatter: (value) =>
                value && i18n.date(value, DateTimeFormatOptions.EightDigitDate),
              flex: 1,
            },
            {
              field: 'counterpart_name',
              sortable: ReceivableCursorFields.includes('counterpart_name'),
              headerName: t(i18n)`Customer`,
              display: 'flex',
              flex: 1,
              renderCell: (params) => (
                <InvoiceCounterpartName
                  counterpartId={params.row.counterpart_id}
                />
              ),
            },
            {
              field: 'expiry_date',
              sortable: false,
              headerName: t(i18n)`Due date`,
              valueFormatter: (value) =>
                value && i18n.date(value, DateTimeFormatOptions.EightDigitDate),
              flex: 1,
            },
            {
              field: 'status',
              sortable: ReceivableCursorFields.includes('status'),
              headerName: t(i18n)`Status`,
              renderCell: (params) => {
                const status = params.value;

                return <InvoiceStatusChip status={status} />;
              },
              flex: 1,
            },
            {
              field: 'amount',
              headerName: t(i18n)`Amount`,
              sortable: ReceivableCursorFields.includes('amount'),
              valueGetter: (_, row) => {
                const value = row.total_amount;

                return value
                  ? formatCurrencyToDisplay(value, row.currency)
                  : '';
              },
              flex: 0.8,
            },
          ]}
          rows={quotes?.data || []}
        />
      </Box>
    </>
  );
};
