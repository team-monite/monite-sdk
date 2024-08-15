import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { useMoniteContext } from '@/core/context/MoniteContext';
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
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortDirection,
  GridSortModel,
  useGridApiRef,
} from '@mui/x-data-grid';

import { InvoiceCounterpartName } from '../InvoiceCounterpartName';
import { ReceivableFilters } from '../ReceivableFilters';
import { useReceivablesFilters } from '../ReceivableFilters/useReceivablesFilters';
import {
  useInvoiceRowActionMenuCell,
  type UseInvoiceRowActionMenuCellProps,
} from './useInvoiceRowActionMenuCell';

interface InvoicesTableBaseProps {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;
}

export type InvoicesTableProps =
  | InvoicesTableBaseProps
  | (UseInvoiceRowActionMenuCellProps & InvoicesTableBaseProps);

export interface ReceivableGridSortModel {
  field: components['schemas']['ReceivableCursorFields'];
  sort: NonNullable<GridSortDirection>;
}

export const InvoicesTable = (props: InvoicesTableProps) => (
  <MoniteScopedProviders>
    <InvoicesTableBase {...props} />
  </MoniteScopedProviders>
);

const InvoicesTableBase = ({
  onRowClick,
  ...restProps
}: InvoicesTableProps) => {
  const { i18n } = useLingui();

  const [paginationToken, setPaginationToken] = useState<string | undefined>(
    undefined
  );

  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );

  const [sortModel, setSortModel] = useState<ReceivableGridSortModel>({
    field: 'created_at',
    sort: 'desc',
  });

  const { formatCurrencyToDisplay } = useCurrencies();
  const { filters, onChangeFilter } = useReceivablesFilters();
  const { api, apiUrl } = useMoniteContext();

  const {
    data: invoices,
    isLoading: isInvoicesLoading,
    isPlaceholderData,
  } = api.receivables.getReceivables.useQuery(
    {
      query: {
        ...filters,
        sort: sortModel?.field,
        order: sortModel?.sort,
        limit: pageSize,
        pagination_token: paginationToken,
        type: 'invoice',
      },
    },
    { placeholderData: (previousData) => previousData }
  );

  const isCounterpartsLoading =
    !!api.counterparts.getCounterpartsId.useIsFetching({
      infinite: false,
      exact: false,
      predicate: (query) =>
        !!invoices?.data?.some(
          ({ counterpart_id }) =>
            !query.state.isInvalidated &&
            counterpart_id === query.queryKey[1].path.counterpart_id
        ),
    });

  const gridApiRef = useGridApiRef();

  const [isTableLoading, setIsTableLoading] = useState(
    isCounterpartsLoading || isInvoicesLoading || isPlaceholderData
  );
  const [, clear] = useDebounce(
    () => {
      setIsTableLoading(
        isCounterpartsLoading || isInvoicesLoading || isPlaceholderData
      );
    },
    30,
    [isCounterpartsLoading, isInvoicesLoading, isPlaceholderData]
  );

  useEffect(() => clear, [clear]);

  useLayoutEffect(() => {
    if (isTableLoading) return;
    if (isCounterpartsLoading) return;
    if (isInvoicesLoading) return;
    if (isPlaceholderData) return;

    if (typeof requestAnimationFrame === 'undefined') return;

    const animationFrame = requestAnimationFrame(() => {
      const columnsToResize = Array.from(gridApiRef.current.getAllColumns())
        .filter(({ hasBeenResized }) => !hasBeenResized)
        .map(({ field }) => field);

      return gridApiRef.current
        .autosizeColumns({
          columns: columnsToResize,
          includeHeaders: true,
          includeOutliers: true,
          expand: true,
        })
        .then(
          () =>
            void gridApiRef.current.scrollToIndexes({
              rowIndex: 0,
              colIndex: 0,
            })
        );
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [
    gridApiRef,
    isCounterpartsLoading,
    isInvoicesLoading,
    isPlaceholderData,
    isTableLoading,
  ]);

  const onChangeSort = (model: GridSortModel) => {
    setSortModel(model[0] as ReceivableGridSortModel);
    setPaginationToken(undefined);
  };

  const invoiceActionCell = useInvoiceRowActionMenuCell({
    rowActions: 'rowActions' in restProps ? restProps.rowActions : undefined,
    onRowActionClick:
      'onRowActionClick' in restProps ? restProps.onRowActionClick : undefined,
  });

  const className = 'Monite-InvoicesTable';

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
          onChange={(field, value) => {
            setPaginationToken(undefined);
            onChangeFilter(field, value);
          }}
          filters={[
            'document_id__contains',
            'status',
            'counterpart_id',
            'due_date__lte',
          ]}
        />
      </Box>

      <DataGrid
        initialState={useMemo(
          () => ({
            sorting: {
              sortModel: sortModel && [sortModel],
            },
          }),
          [sortModel]
        )}
        disableAutosize
        apiRef={gridApiRef}
        rowSelection={false}
        disableColumnFilter={true}
        loading={
          isTableLoading ||
          isCounterpartsLoading ||
          isInvoicesLoading ||
          isPlaceholderData
        }
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
        slots={useMemo(
          () => ({
            pagination: () => (
              <TablePagination
                nextPage={invoices?.next_pagination_token}
                prevPage={invoices?.prev_pagination_token}
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
          }),
          [
            invoices?.next_pagination_token,
            invoices?.prev_pagination_token,
            pageSize,
            paginationToken,
          ]
        )}
        rows={invoices?.data ?? []}
        columns={useMemo<GridColDef[]>(() => {
          return [
            {
              field: 'document_id',
              headerName: t(i18n)`Number`,
              sortable: false,
              renderCell: ({ value }) => {
                if (!value) {
                  return t(i18n)`INV-auto`;
                }

                return value;
              },
            },
            {
              field: 'counterpart_name',
              headerName: t(i18n)`Customer`,
              sortable: ReceivableCursorFields.includes('counterpart_name'),
              display: 'flex',
              renderCell: (params) => (
                <InvoiceCounterpartName
                  counterpartId={params.row.counterpart_id}
                />
              ),
            },
            {
              field: 'created_at',
              headerName: t(i18n)`Created on`,
              sortable: false,
              valueFormatter: (value) =>
                value
                  ? i18n.date(value, DateTimeFormatOptions.EightDigitDate)
                  : '—',
            },
            {
              field: 'issue_date',
              headerName: t(i18n)`Issue date`,
              sortable: false,
              valueFormatter: (value) =>
                value
                  ? i18n.date(value, DateTimeFormatOptions.EightDigitDate)
                  : '—',
            },
            {
              field: 'status',
              headerName: t(i18n)`Status`,
              sortable: ReceivableCursorFields.includes('status'),
              renderCell: (
                params: GridRenderCellParams<
                  components['schemas']['ReceivableResponse']
                >
              ) => {
                const status = params.value;
                return <InvoiceStatusChip status={status} />;
              },
            },
            {
              field: 'total_amount',
              headerName: t(i18n)`Amount`,
              sortable: ReceivableCursorFields.includes('amount'),
              valueGetter: (_, row) => {
                const value = row.total_amount;

                return value
                  ? formatCurrencyToDisplay(value, row.currency)
                  : '';
              },
            },
            {
              field: 'due_date',
              headerName: t(i18n)`Due date`,
              sortable: false,
              valueFormatter: (value) =>
                value
                  ? i18n.date(value, DateTimeFormatOptions.EightDigitDate)
                  : '—',
            },
            ...(invoiceActionCell ? [invoiceActionCell] : []),
          ];
        }, [formatCurrencyToDisplay, i18n, invoiceActionCell])}
      />
    </Box>
  );
};
