import { useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { InvoiceCounterpartName } from '@/components/receivables/InvoiceCounterpartName';
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
import { DataGrid, GridSortModel } from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { ReceivableFilters } from '../ReceivableFilters';
import { useReceivablesFilters } from '../ReceivableFilters/useReceivablesFilters';

type CreditNotesTableProps = {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;
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

const CreditNotesTableBase = ({ onRowClick }: CreditNotesTableProps) => {
  const { i18n } = useLingui();

  const [paginationToken, setPaginationToken] = useState<string | undefined>(
    undefined
  );

  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );

  const [sortModel, setSortModel] = useState<CreditNotesTableSortModel>({
    field: 'created_at',
    sort: 'desc',
  });

  const { formatCurrencyToDisplay } = useCurrencies();
  const { onChangeFilter, filters } = useReceivablesFilters();

  const { data: creditNotes, isLoading } = useReceivables({
    ...filters,
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

  const gridApiRef = useAutosizeGridColumns(creditNotes);

  const className = 'Monite-CreditNotesTable';

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
          initialState={{
            sorting: {
              sortModel: [sortModel],
            },
          }}
          apiRef={gridApiRef}
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
          }}
          columns={[
            {
              field: 'document_id',
              headerName: t(i18n)`Number`,
              flex: 1.3,
            },
            {
              field: 'created_at',
              headerName: t(i18n)`Created on`,
              valueFormatter: (value) =>
                value
                  ? i18n.date(value, DateTimeFormatOptions.EightDigitDate)
                  : '—',
              flex: 0.7,
            },
            {
              field: 'issue_date',
              headerName: t(i18n)`Issue date`,
              valueFormatter: (value) =>
                value && i18n.date(value, DateTimeFormatOptions.EightDigitDate),
              flex: 0.7,
            },
            {
              field: 'counterpart_name',
              headerName: t(i18n)`Customer`,
              sortable: ReceivableCursorFields.includes('counterpart_name'),
              display: 'flex',
              flex: 1,
              renderCell: (params) => (
                <InvoiceCounterpartName
                  counterpartId={params.row.counterpart_id}
                />
              ),
            },
            {
              field: 'status',
              headerName: t(i18n)`Status`,
              sortable: ReceivableCursorFields.includes('status'),
              flex: 1,
              renderCell: (params) => {
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

                return value && formatCurrencyToDisplay(value, row.currency);
              },
              flex: 0.5,
            },
          ]}
          rows={creditNotes?.data ?? []}
        />
      </Box>
    </>
  );
};
