import { useMemo, useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import {
  ReceivableFilterType,
  ReceivablesTabFilter,
} from '@/components/receivables/ReceivablesTable/types';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  defaultCounterpartColumnWidth,
  useAutosizeGridColumns,
} from '@/core/hooks/useAutosizeGridColumns';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useGetFinancedInvoices } from '@/core/queries/useFinancing';
import { ReceivableCursorFields } from '@/enums/ReceivableCursorFields';
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
import { Box, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridSortDirection,
  GridSortModel,
} from '@mui/x-data-grid';

import { UseInvoiceRowActionMenuCellProps } from '../../../InvoicesTable/useInvoiceRowActionMenuCell';

interface FinancedInvoicesTableBaseProps {
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
}

export type FinancedInvoicesTableProps =
  | FinancedInvoicesTableBaseProps
  | (UseInvoiceRowActionMenuCellProps & FinancedInvoicesTableBaseProps);

export interface ReceivableGridSortModel {
  field: components['schemas']['ReceivableCursorFields'];
  sort: NonNullable<GridSortDirection>;
}

export const FinancedInvoicesTable = (props: FinancedInvoicesTableProps) => (
  <MoniteScopedProviders>
    <FinancedInvoicesTableBase {...props} />
  </MoniteScopedProviders>
);

const FinancedInvoicesTableBase = ({
  onRowClick,
  query,
}: FinancedInvoicesTableProps) => {
  const { i18n } = useLingui();

  const [paginationToken, setPaginationToken] = useState<string | undefined>(
    undefined
  );

  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );

  const [sortModel, setSortModel] = useState<ReceivableGridSortModel>({
    field: query?.sort ?? 'created_at',
    sort: query?.order ?? 'desc',
  });

  const { formatCurrencyToDisplay } = useCurrencies();
  const {
    data: invoices,
    isLoading,
    isError,
    refetch,
  } = useGetFinancedInvoices({
    order: sortModel?.sort,
    limit: pageSize,
    pagination_token: paginationToken,
  });

  const collection = invoices;
  const collectionData = collection?.data;

  const onChangeSort = (model: GridSortModel) => {
    setSortModel(model[0] as ReceivableGridSortModel);
    setPaginationToken(undefined);
  };

  const dateFormat = useDateFormat();

  const columns = useMemo<
    GridColDef<components['schemas']['FinancingInvoice']>[]
  >(() => {
    return [
      {
        field: 'document_id',
        headerName: t(i18n)`Number`,
        sortable: false,
        width: 100,
        renderCell: ({ value }) => {
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
        field: 'payer_type',
        headerName: t(i18n)`Customer`,
        display: 'flex',
        width: defaultCounterpartColumnWidth,
        renderCell: (params) => (
          <Typography>
            {params.row.payer_type == 'BUSINESS'
              ? params.row.payer_business_name
              : `${params.row.payer_first_name} ${params.row.payer_last_name}`}
          </Typography>
        ),
      },
      {
        field: 'status',
        headerName: t(i18n)`Status`,
        sortable: ReceivableCursorFields.includes('status'),
        width: 80,
        renderCell: ({ value: status }) => {
          return <InvoiceStatusChip status={status} />;
        },
      },
      {
        field: 'total_amount',
        headerName: t(i18n)`Amount due`,
        headerAlign: 'right',
        align: 'right',
        width: 120,
        valueGetter: (_, row) => {
          const value = row.repayment_schedule?.repayment_amount;

          return value ? formatCurrencyToDisplay(value, row.currency) : '-';
        },
      },
      {
        field: 'repayment_schedule',
        headerName: t(i18n)`Loan sum`,
        headerAlign: 'right',
        align: 'right',
        width: 120,
        valueGetter: (_, row) => {
          const value = row.repayment_schedule?.repayment_principal_amount;

          return value ? formatCurrencyToDisplay(value, row.currency) : '-';
        },
      },
      {
        field: 'issue_date',
        headerName: t(i18n)`Financing date`,
        sortable: false,
        width: 140,
        valueFormatter: (value) => (value ? i18n.date(value, dateFormat) : '—'),
      },
      {
        field: 'due_date',
        headerName: t(i18n)`Payment date`,
        sortable: false,
        width: 120,
        valueFormatter: (value) => (value ? i18n.date(value, dateFormat) : '—'),
      },
    ];
  }, [formatCurrencyToDisplay, i18n, dateFormat]);

  const gridApiRef = useAutosizeGridColumns(
    collectionData,
    columns,
    false,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    'FinancedInvoicesTable'
  );
  if (!isLoading && collectionData?.length === 0) {
    return (
      <DataGridEmptyState
        title={t(i18n)`No financed invoices yet`}
        descriptionLine1={t(
          i18n
        )`Select invoices you would like to finance and send them for review.`}
        descriptionLine2={t(i18n)`What invoices can be financed?.`}
        type="no-data"
      />
    );
  }

  const className = 'Monite-FinancedInvoicesTable';

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
      <Typography mb={2} variant="subtitle1">{t(
        i18n
      )`Financed invoices`}</Typography>

      <DataGrid
        apiRef={gridApiRef}
        rowSelection={false}
        disableColumnFilter={true}
        loading={isLoading}
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
          noRowsOverlay: () => (
            <GetNoRowsOverlay
              isLoading={isLoading}
              dataLength={collectionData?.length || 0}
              isFiltering={false}
              isSearching={false}
              isError={isError}
              refetch={refetch}
              entityName={t(i18n)`Invoices`}
              actionOptions={[t(i18n)`Invoice`]}
              type="no-data"
            />
          ),
        }}
        columns={columns}
        getRowId={(row) => row.document_id}
        rows={collectionData ?? []}
      />
    </Box>
  );
};
