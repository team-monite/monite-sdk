import { useEffect, useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useAutosizeGridColumns } from '@/core/hooks/useAutosizeGridColumns';
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

  const { data: invoices, isLoading } = useReceivables({
    ...filters,
    sort: sortModel?.field,
    order: sortModel?.sort,
    limit: pageSize,
    pagination_token: paginationToken,
    type: 'invoice',
  });

  const onChangeSort = (model: GridSortModel) => {
    setSortModel(model[0] as ReceivableGridSortModel);
    setPaginationToken(undefined);
  };

  const invoiceActionCell = useInvoiceRowActionMenuCell({
    rowActions: 'rowActions' in restProps && restProps.rowActions,
    onRowActionClick:
      'onRowActionClick' in restProps && restProps.onRowActionClick,
  });

  const [columns, setColumns] = useState<GridColDef[]>([]);
  useEffect(() => {
    setColumns([
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
          <InvoiceCounterpartName counterpartId={params.row.counterpart_id} />
        ),
      },
      {
        field: 'created_at',
        headerName: t(i18n)`Created on`,
        sortable: false,
        valueFormatter: (value) =>
          value ? i18n.date(value, DateTimeFormatOptions.EightDigitDate) : '—',
      },
      {
        field: 'issue_date',
        headerName: t(i18n)`Issue date`,
        sortable: false,
        valueFormatter: (value) =>
          value ? i18n.date(value, DateTimeFormatOptions.EightDigitDate) : '—',
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
        field: 'amount',
        headerName: t(i18n)`Amount`,
        sortable: ReceivableCursorFields.includes('amount'),
        valueGetter: (_, row) => {
          const value = row.total_amount;

          return value ? formatCurrencyToDisplay(value, row.currency) : '';
        },
      },
      {
        field: 'due_date',
        headerName: t(i18n)`Due date`,
        sortable: false,
        valueFormatter: (value) =>
          value ? i18n.date(value, DateTimeFormatOptions.EightDigitDate) : '—',
      },
      ...(invoiceActionCell ? [invoiceActionCell] : []),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceActionCell]);

  const gridApiRef = useAutosizeGridColumns(invoices?.data, columns);

  const className = 'Monite-InvoicesTable';

  return (
    <>
      <Box
        sx={{ padding: 2, width: '100%' }}
        className={classNames(ScopedCssBaselineContainerClassName, className)}
      >
        <Box sx={{ marginBottom: 2 }}>
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

        <DataGrid<components['schemas']['ReceivableResponse']>
          initialState={{
            sorting: {
              sortModel: sortModel && [sortModel],
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
          }}
          columns={columns}
          rows={invoices?.data ?? []}
        />
      </Box>
    </>
  );
};
