import React, { useState } from 'react';

import { ROW_TO_TAG_STATUS_MUI_MAP } from '@/components/receivables/consts';
import {
  FILTER_TYPE_CUSTOMER,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
} from '@/components/receivables/consts';
import { getCommonStatusLabel } from '@/components/receivables/getCommonStatusLabel';
import { PAGE_LIMIT } from '@/constants';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useReceivables } from '@/core/queries';
import { TablePagination } from '@/ui/table/TablePagination';
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
import { Box, Chip, Typography } from '@mui/material';
import {
  DataGrid,
  GridRenderCellParams,
  GridSortModel,
} from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { Filters } from '../Filters';
import { useReceivablesFilters } from '../Filters/useReceivablesFilters';
import { InvoiceCounterpartCell } from './InvoiceCounterpartCell';

type InvoicesTableProps = {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;
};

export interface InvoicesTableSortModel {
  field: ReceivableCursorFields;
  sort: GridSortDirection;
}

export const InvoicesTable = (props: InvoicesTableProps) => (
  <MoniteStyleProvider>
    <InvoicesTableBase {...props} />
  </MoniteStyleProvider>
);

const InvoicesTableBase = ({ onRowClick }: InvoicesTableProps) => {
  const { i18n } = useLingui();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [sortModel, setSortModel] = useState<Array<InvoicesTableSortModel>>([]);
  const sortModelItem = sortModel[0];

  const { formatCurrencyToDisplay } = useCurrencies();
  const { onChangeFilter, currentFilters } = useReceivablesFilters();

  const { data: invoices, isLoading } = useReceivables(
    sortModelItem ? (sortModelItem.sort as OrderEnum) : undefined,
    PAGE_LIMIT,
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

  const onPrev = () =>
    setCurrentPaginationToken(invoices?.prev_pagination_token || null);

  const onNext = () =>
    setCurrentPaginationToken(invoices?.next_pagination_token || null);

  return (
    <>
      <Box sx={{ padding: 2, width: '100%' }}>
        <Box sx={{ marginBottom: 2 }}>
          <Filters onChangeFilter={onChangeFilter} />
        </Box>
        <DataGrid
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
                isNextAvailable={Boolean(invoices?.next_pagination_token)}
                onNext={onNext}
                isPreviousAvailable={Boolean(invoices?.prev_pagination_token)}
                onPrevious={onPrev}
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
              field: 'counterpart_id',
              headerName: t(i18n)`Customer`,
              sortable: false,
              flex: 1.3,
              renderCell: (params) => (
                <InvoiceCounterpartCell counterpartId={params.value} />
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
                  ? i18n.date(
                      params.value,
                      DateTimeFormatOptions.EightDigitDate
                    )
                  : '—',
              flex: 0.7,
            },
            {
              field: 'status',
              headerName: t(i18n)`Status`,
              sortable: false,
              renderCell: (
                params: GridRenderCellParams<ReceivableResponse>
              ) => {
                const status = params.value as ReceivablesStatusEnum;

                return (
                  <Chip
                    color={ROW_TO_TAG_STATUS_MUI_MAP[status]}
                    label={getCommonStatusLabel(status, i18n)}
                    variant="filled"
                  />
                );
              },
              flex: 1,
            },
            {
              field: 'amount',
              headerName: t(i18n)`Amount`,
              valueGetter: (params) => {
                const row = params.row as InvoiceResponsePayload;
                const value = row.total_amount;

                return value
                  ? formatCurrencyToDisplay(value, row.currency)
                  : '';
              },
              flex: 0.5,
            },
            {
              field: 'fulfillment_date',
              headerName: t(i18n)`Due date`,
              sortable: false,
              valueFormatter: (params) =>
                params.value
                  ? i18n.date(
                      params.value,
                      DateTimeFormatOptions.EightDigitDate
                    )
                  : '—',
              flex: 0.7,
            },
          ]}
          rows={invoices?.data ?? []}
        />
      </Box>
    </>
  );
};
