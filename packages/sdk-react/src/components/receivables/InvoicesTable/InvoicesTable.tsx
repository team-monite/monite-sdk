import React, { useState } from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import {
  FILTER_TYPE_CUSTOMER,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
} from '@/components/receivables/consts';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useReceivables } from '@/core/queries';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  InvoiceResponsePayload,
  OrderEnum,
  ReceivableCursorFields,
  ReceivableResponse,
  ReceivablesStatusEnum,
  ReceivableType,
} from '@monite/sdk-api';
import { Box, Typography } from '@mui/material';
import {
  DataGrid,
  GridRenderCellParams,
  GridSortModel,
} from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid/models/colDef/gridColDef';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { Filters } from '../Filters';
import { useReceivablesFilters } from '../Filters/useReceivablesFilters';
import { InvoiceCounterpartName } from '../InvoiceCounterpartName';
import {
  type InvoiceActionHandler,
  InvoiceActionMenu,
} from './InvoiceActionMenu';

type InvoicesTableProps = {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;

  /**
   * The event handler for a row action.
   * See `MoniteInvoiceActionMenu` documentation for more details.
   */
  onRowAction?: InvoiceActionHandler;
};

export interface InvoicesTableSortModel {
  field: ReceivableCursorFields;
  sort: GridSortDirection;
}

export const InvoicesTable = (props: InvoicesTableProps) => (
  <MoniteScopedProviders>
    <InvoicesTableBase {...props} />
  </MoniteScopedProviders>
);

const InvoicesTableBase = ({ onRowClick, onRowAction }: InvoicesTableProps) => {
  const { i18n } = useLingui();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );
  const [sortModel, setSortModel] = useState<Array<InvoicesTableSortModel>>([]);
  const sortModelItem = sortModel[0];

  const { formatCurrencyToDisplay } = useCurrencies();
  const { onChangeFilter, currentFilters } = useReceivablesFilters();

  const { data: invoices, isLoading } = useReceivables(
    sortModelItem ? (sortModelItem.sort as OrderEnum) : undefined,
    pageSize,
    currentPaginationToken || undefined,
    sortModelItem ? sortModelItem.field : undefined,
    ReceivableType.INVOICE,
    undefined,
    currentFilters[FILTER_TYPE_SEARCH] || undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    currentFilters[FILTER_TYPE_CUSTOMER] || undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    currentFilters[FILTER_TYPE_STATUS] || undefined
  );

  const onChangeSort = (m: GridSortModel) => {
    const model = m as Array<InvoicesTableSortModel>;
    setSortModel(model);
    setCurrentPaginationToken(null);
  };

  const invoiceActionCellTuple: [GridColDef<ReceivableResponse>] | [] =
    onRowAction
      ? [
          {
            field: 'action_menu',
            headerName: t(i18n)`Action menu`,
            renderHeader: () => null,
            sortable: false,
            resizable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0,
            align: 'center',
            renderCell: ({ row }) => (
              <InvoiceActionMenu
                onClick={onRowAction}
                invoice={row as InvoiceResponsePayload}
              />
            ),
          },
        ]
      : [];

  // Workaround to prevent illegal sorting fields
  const receivableCursorFieldsList = Object.values(ReceivableCursorFields);

  return (
    <Box
      sx={{ padding: 2, width: '100%' }}
      className={ScopedCssBaselineContainerClassName}
    >
      <Box sx={{ marginBottom: 2 }}>
        <Filters onChangeFilter={onChangeFilter} />
      </Box>
      <DataGrid
        rowSelection={false}
        loading={isLoading}
        sx={{
          '& .MuiDataGrid-withBorderColor': {
            borderColor: 'divider',
          },
          '&.MuiDataGrid-withBorderColor': {
            borderColor: 'divider',
          },
        }}
        sortModel={sortModel}
        onSortModelChange={onChangeSort}
        onRowClick={(params) => onRowClick?.(params.row.id)}
        slots={{
          pagination: () => (
            <TablePagination
              nextPage={invoices?.next_pagination_token}
              prevPage={invoices?.prev_pagination_token}
              paginationModel={{
                pageSize,
                page: currentPaginationToken,
              }}
              onPaginationModelChange={({ page, pageSize }) => {
                setPageSize(pageSize);
                setCurrentPaginationToken(page);
              }}
            />
          ),
        }}
        columns={[
          {
            field: 'document_id',
            headerName: t(i18n)`Number`,
            sortable: false,
            flex: 1,
            renderCell: ({ value }) => {
              if (!value) {
                return (
                  <Typography variant="body1" color="secondary">{t(
                    i18n
                  )`INV-auto`}</Typography>
                );
              }

              return <Typography variant="body1">{value}</Typography>;
            },
          },
          {
            field: 'counterpart_name',
            headerName: t(i18n)`Customer`,
            sortable: receivableCursorFieldsList.includes(
                ReceivableCursorFields.COUNTERPART_NAME
              ),
            flex: 1.3,
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
            valueFormatter: ({ value }) =>
              value
                ? i18n.date(value, DateTimeFormatOptions.EightDigitDate)
                : '—',
            flex: 0.7,
          },
          {
            field: 'issue_date',
            headerName: t(i18n)`Issue date`,
            sortable: false,
            valueFormatter: (params) =>
              params.value
                ? i18n.date(params.value, DateTimeFormatOptions.EightDigitDate)
                : '—',
            flex: 0.7,
          },
          {
            field: 'status',
            headerName: t(i18n)`Status`,
            sortable: receivableCursorFieldsList.includes(
                ReceivableCursorFields.STATUS
              ),
            renderCell: (params: GridRenderCellParams<ReceivableResponse>) => {
              const status = params.value as ReceivablesStatusEnum;
              return <InvoiceStatusChip status={status} />;
            },
            flex: 1,
          },
          {
            field: 'amount',
            headerName: t(i18n)`Amount`,
              sortable: receivableCursorFieldsList.includes(
                ReceivableCursorFields.AMOUNT
              ),
            valueGetter: (params) => {
              const row = params.row as InvoiceResponsePayload;
              const value = row.total_amount;

              return value ? formatCurrencyToDisplay(value, row.currency) : '';
            },
            flex: 0.5,
          },
          {
            field: 'fulfillment_date',
            headerName: t(i18n)`Due date`,
            sortable: false,
            valueFormatter: (params) =>
              params.value
                ? i18n.date(params.value, DateTimeFormatOptions.EightDigitDate)
                : '—',
            flex: 0.7,
          },
          ...invoiceActionCellTuple,
        ]}
        rows={invoices?.data ?? []}
      />
    </Box>
  );
};
