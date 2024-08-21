import { useMemo, useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { InvoiceRecurrenceStatusChip } from '@/components/receivables/InvoiceRecurrenceStatusChip';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  defaultCounterpartColumnWidth,
  useAutosizeGridColumns,
  useAreCounterpartsLoading,
} from '@/core/hooks/useAutosizeGridColumns';
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
import { Box, Skeleton, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
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
    rowActions: 'rowActions' in restProps ? restProps.rowActions : undefined,
    onRowActionClick:
      'onRowActionClick' in restProps ? restProps.onRowActionClick : undefined,
  });

  const areCounterpartsLoading = useAreCounterpartsLoading(invoices?.data);

  const columns = useMemo<
    GridColDef<components['schemas']['ReceivableResponse']>[]
  >(() => {
    return [
      {
        field: 'document_id',
        headerName: t(i18n)`Number`,
        sortable: false,
        width: 100,
        renderCell: ({ value, row }) => {
          if (row.status === 'recurring')
            return (
              <span className="Monite-TextOverflowContainer">
                {t(i18n)`Recurring`}
              </span>
            );

          if (!value) {
            return (
              <span className="Monite-TextOverflowContainer">
                <Typography
                  color="text.secondary"
                  component="span"
                  fontSize="inherit"
                >{t(i18n)`INV-auto`}</Typography>
              </span>
            );
          }

          return <span className="Monite-TextOverflowContainer">{value}</span>;
        },
      },
      {
        field: 'counterpart_name',
        headerName: t(i18n)`Customer`,
        sortable: ReceivableCursorFields.includes('counterpart_name'),
        display: 'flex',
        width: defaultCounterpartColumnWidth,
        renderCell: (params) => (
          <InvoiceCounterpartName counterpartId={params.row.counterpart_id} />
        ),
      },
      {
        field: 'created_at',
        headerName: t(i18n)`Created on`,
        sortable: false,
        width: 140,
        valueFormatter: (value) =>
          value ? i18n.date(value, DateTimeFormatOptions.EightDigitDate) : '—',
      },
      {
        field: 'issue_date',
        headerName: t(i18n)`Issue date`,
        sortable: false,
        width: 120,
        valueFormatter: (value) =>
          value ? i18n.date(value, DateTimeFormatOptions.EightDigitDate) : '—',
      },
      {
        field: 'status',
        headerName: t(i18n)`Status`,
        sortable: ReceivableCursorFields.includes('status'),
        width: 80,
        renderCell: ({ value: status, row }) => {
          if (row.type === 'invoice' && row.recurrence_id) {
            return (
              <InvoiceRecurrenceStatusChipLoader
                recurrenceId={row.recurrence_id}
              />
            );
          }

          return <InvoiceStatusChip status={status} />;
        },
      },
      {
        field: 'total_amount',
        headerName: t(i18n)`Amount`,
        sortable: ReceivableCursorFields.includes('amount'),
        width: 120,
        valueGetter: (_, row) => {
          const value = row.total_amount;

          return value ? formatCurrencyToDisplay(value, row.currency) : '';
        },
      },
      {
        field: 'due_date',
        headerName: t(i18n)`Due date`,
        sortable: false,
        width: 120,
        valueFormatter: (value) =>
          value ? i18n.date(value, DateTimeFormatOptions.EightDigitDate) : '—',
      },
      ...(invoiceActionCell ? [invoiceActionCell] : []),
    ];
  }, [formatCurrencyToDisplay, i18n, invoiceActionCell]);

  const gridApiRef = useAutosizeGridColumns(
    invoices?.data,
    columns,
    areCounterpartsLoading,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    'InvoicesTable'
  );

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
  );
};

const InvoiceRecurrenceStatusChipLoader = ({
  recurrenceId,
}: {
  recurrenceId: string;
}) => {
  const { api } = useMoniteContext();

  const { data: recurrence, isLoading } =
    api.recurrences.getRecurrencesId.useQuery({
      path: { recurrence_id: recurrenceId },
    });

  if (isLoading) {
    return (
      <Skeleton
        variant="rounded"
        width="100%"
        sx={{ display: 'inline-block' }}
      />
    );
  }

  if (!recurrence?.status) return null;

  return <InvoiceRecurrenceStatusChip status={recurrence.status} />;
};
