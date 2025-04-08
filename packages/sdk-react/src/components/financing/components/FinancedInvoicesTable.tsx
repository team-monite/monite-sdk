import { useMemo, useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { Dialog } from '@/components/Dialog';
import { FinancedInvoiceStatusChip } from '@/components/financing/components';
import { useGetFinancedInvoices } from '@/components/financing/hooks';
import { UseInvoiceRowActionMenuCellProps } from '@/components/receivables/hooks';
import {
  ReceivableFilterType,
  ReceivablesTabFilter,
} from '@/components/receivables/types';
import { useKanmonContext } from '@/core/context/KanmonContext';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  defaultCounterpartColumnWidth,
  useAutosizeGridColumns,
} from '@/core/hooks/useAutosizeGridColumns';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useReceivableById } from '@/core/queries';
import { ReceivableCursorFields } from '@/enums/ReceivableCursorFields';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { TablePagination } from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Button, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortDirection,
  GridSortModel,
} from '@mui/x-data-grid';

import { FinanceDetails } from './FinanceDetails';

interface FinancedInvoicesTableBaseProps {
  /**
   * The event handler for a row click.
   *
   * @param invoice_id - The identifier of the clicked row, a string.
   */
  onRowClick?: (invoice_id: string) => void;

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
  offers?: components['schemas']['FinancingOffer'][];
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
  offers,
}: FinancedInvoicesTableProps) => {
  const { i18n } = useLingui();
  const { locale, componentSettings } = useMoniteContext();
  const { startFinanceSession } = useKanmonContext();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [financedInvoice, setFinancedInvoice] = useState<
    components['schemas']['FinancingInvoice'] | null
  >(null);
  const { data: invoice } = useReceivableById(
    financedInvoice?.invoice_id ?? '',
    Boolean(financedInvoice?.invoice_id)
  );

  const [paginationToken, setPaginationToken] = useState<string | undefined>(
    undefined
  );

  const [pageSize, setPageSize] = useState<number>(
    componentSettings.receivables.pageSizeOptions?.[0] ?? 15
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

  const dateFormat = locale.dateFormat;

  const columns = useMemo<
    GridColDef<components['schemas']['FinancingInvoice']>[]
  >(() => {
    return [
      {
        field: 'document_id',
        headerName: t(i18n)`Number`,
        sortable: false,
        width: 140,
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
        width: 160,
        renderCell: ({ value: status }) => {
          return <FinancedInvoiceStatusChip icon status={status} />;
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
      {
        field: '',
        headerName: t(i18n)`Payment`,
        sortable: false,
        width: 120,
        renderCell: (
          params: GridRenderCellParams<
            components['schemas']['FinancingInvoice']
          >
        ) => {
          const shouldDisplayButton =
            params.row.status === 'FUNDED' || params.row.status === 'LATE';

          return shouldDisplayButton ? (
            <Button
              variant="contained"
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                startFinanceSession({ component: 'PAY_NOW' });
              }}
              sx={{ py: 1.25, px: 1.5, height: 32, fontSize: 14 }}
            >
              {t(i18n)`Repay now`}
            </Button>
          ) : null;
        },
      },
    ];
  }, [formatCurrencyToDisplay, i18n, dateFormat, startFinanceSession]);

  const gridApiRef = useAutosizeGridColumns(
    collectionData,
    columns,
    false,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    'FinancedInvoicesTable'
  );

  const className = 'Monite-FinancedInvoicesTable';

  return (
    <Box
      className={classNames(ScopedCssBaselineContainerClassName, className)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: 'inherit',
        minHeight: '500px',
        pb: 4,
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
        onRowClick={(params) => {
          setDialogIsOpen(true);
          setFinancedInvoice?.(params.row);
        }}
        slots={{
          pagination: () => (
            <TablePagination
              pageSizeOptions={componentSettings.receivables.pageSizeOptions}
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
              entityName={t(i18n)`Financed Invoices`}
              actionOptions={[t(i18n)`Invoice`]}
              noDataDescription2={t(
                i18n
              )`Select invoices you would like to finance and send them for review.`}
              type="no-data"
            />
          ),
        }}
        columns={columns}
        getRowId={(row) => row.document_id}
        rows={collectionData ?? []}
      />

      {invoice && financedInvoice && (
        <Dialog
          open={dialogIsOpen}
          onClose={() => {
            setDialogIsOpen(false);
            setFinancedInvoice(null);
          }}
          alignDialog="right"
        >
          <FinanceDetails
            invoice={invoice as any}
            offers={offers ?? []}
            financedInvoice={financedInvoice}
            enableNavigate
            handleNavigate={onRowClick}
          />
        </Dialog>
      )}
    </Box>
  );
};
