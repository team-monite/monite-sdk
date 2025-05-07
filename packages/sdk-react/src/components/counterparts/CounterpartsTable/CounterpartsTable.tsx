import { useEffect, useMemo, useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { CounterpartStatusChip } from '@/components/counterparts/components';
import type { CounterpartShowCategories } from '@/components/counterparts/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useCounterpartList } from '@/core/queries/useCounterpart';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { CounterpartNameCountryAddressCellById } from '@/ui/CounterpartCell/CounterpartCell';
import { DataGridEmptyState } from '@/ui/DataGridEmptyState';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { LoadingPage } from '@/ui/loadingPage';
import { TablePagination } from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { hasSelectedText } from '@/utils/text-selection';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import {
  FILTER_TYPE_IS_CUSTOMER,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
} from './consts';
import { Filters as FiltersComponent } from './Filters';
// import * as Styled from './styles';
import { Filters, FilterValue, Sort } from './types';

interface CounterpartGridSortModel {
  field: components['schemas']['CounterpartCursorFields'];
  sort: NonNullable<GridSortDirection>;
}

/**
 * Props for the CounterpartsTable component.
 */
export type CounterpartsTableProps = Partial<CounterpartShowCategories> & {
  /**
   * Callback function that is called when a row is clicked.
   * @param id - The ID of the clicked counterpart.
   */
  onRowClick?: (id: string) => void;

  /**
   * Callback function that is called when the sort order is changed.
   * @param params - An object containing the sort field and the sort order.
   * @param params.field - The field to sort by.
   * @param params.sort - The sort order (either ascending, descending, or null).
   */
  onChangeSort?: (params: CounterpartGridSortModel) => void;

  /**
   * Callback function that is called when the filter is changed.
   * @param filter - An object containing the filter field and value.
   * @param filter.field - The field to filter by.
   * @param filter.value - The value to filter with.
   */
  onChangeFilter?: (filter: {
    field: keyof Filters;
    value: FilterValue;
  }) => void;

  openModal?: (open: boolean) => void;
};

export const CounterpartsTable = (props: CounterpartsTableProps) => (
  <MoniteScopedProviders>
    <CounterpartsTableBase {...props} />
  </MoniteScopedProviders>
);

const CounterpartsTableBase = ({
  onRowClick,
  onChangeSort: onChangeSortCallback,
  onChangeFilter: onChangeFilterCallback,
  showCategories = true,
  openModal,
}: CounterpartsTableProps) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();

  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    componentSettings.counterparts.pageSizeOptions[0]
  );
  const [currentSort] = useState<Sort | null>(null);
  const [currentFilter, setCurrentFilter] = useState<Filters>({});
  const [sortModel, setSortModel] = useState<
    CounterpartGridSortModel | undefined
  >(undefined);

  /**
   * `isUpdateSupported` and `isDeleteSupported` should be defined by `created_by_entity_user_id` from counterpart record.
   * Currently, it is not possible, counterpart record does not have this parameter
   * https://monite.atlassian.net/browse/DEV-6311
   */
  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadSupported, isLoading: isReadSupportedLoading } =
    useIsActionAllowed({
      method: 'counterpart',
      action: 'read',
      entityUserId: user?.id,
    });

  const {
    data: counterparts,
    isLoading,
    refetch,
    isError,
  } = useCounterpartList({
    query: {
      sort: sortModel?.field,
      order: sortModel?.sort,
      limit: pageSize || undefined,
      pagination_token: currentPaginationToken || undefined,
      type: currentFilter[FILTER_TYPE_TYPE] || undefined,
      counterpart_name__icontains:
        currentFilter[FILTER_TYPE_SEARCH] || undefined,
      is_vendor:
        currentFilter[FILTER_TYPE_IS_CUSTOMER] === 'false' ? true : undefined,
      is_customer:
        currentFilter[FILTER_TYPE_IS_CUSTOMER] === 'true' ? true : undefined,
    },
  });

  useEffect(() => {
    refetch();
  }, [currentPaginationToken, currentSort, currentFilter, refetch]);

  const onChangeSort = (m: GridSortModel) => {
    setSortModel(m[0] as CounterpartGridSortModel);
    setCurrentPaginationToken(null);

    onChangeSortCallback?.(m[0] as CounterpartGridSortModel);
  };

  const onChangeFilter = (field: keyof Filters, value: FilterValue) => {
    setCurrentPaginationToken(null);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value === 'all' ? null : value,
    }));

    onChangeFilterCallback && onChangeFilterCallback({ field, value });
  };

  const columns = useMemo<
    GridColDef<components['schemas']['CounterpartResponse']>[]
  >(() => {
    return [
      {
        field: 'counterpart_name',
        sortable: true,
        headerName: t(i18n)`Counterpart`,
        display: 'flex',
        flex: 1,
        renderCell: (params) => {
          const counterpart = params.row;
          return (
            <CounterpartNameCountryAddressCellById
              counterpartId={counterpart.id}
            />
          );
        },
      },
      {
        field: 'category',
        sortable: false,
        headerName: t(i18n)`Category`,
        display: 'flex',
        flex: 0.6,
        renderCell: (params) => {
          const counterpart = params.row;

          const { is_customer, is_vendor } =
            'organization' in counterpart
              ? counterpart.organization
              : counterpart.individual;

          return (
            <Stack direction="row" spacing={1}>
              {is_customer && <CounterpartStatusChip status="customer" />}
              {is_vendor && <CounterpartStatusChip status="vendor" />}
            </Stack>
          );
        },
      },
      {
        field: 'contacts',
        sortable: false,
        flex: 1,
        display: 'flex',
        headerName: t(i18n)`Email`,
        renderCell: (params) => {
          const counterpart = params.row;

          const { email } =
            'organization' in counterpart
              ? counterpart.organization
              : counterpart.individual;

          return <span>{email}</span>;
        },
      },
    ];
  }, [i18n]);

  if (isReadSupportedLoading) {
    return <LoadingPage />;
  }

  if (!isReadSupported) {
    return <AccessRestriction />;
  }

  const className = 'Monite-CounterpartsTable';

  const isFiltering = Object.keys(currentFilter).some(
    (key) =>
      currentFilter[key as keyof Filters] !== null &&
      currentFilter[key as keyof Filters] !== undefined
  );
  const isSearching = !!currentFilter[FILTER_TYPE_SEARCH];

  if (
    !isLoading &&
    counterparts?.data.length === 0 &&
    !isFiltering &&
    !isSearching
  ) {
    return (
      <DataGridEmptyState
        title={t(i18n)`No counterparts yet`}
        descriptionLine1={t(i18n)`You don’t have any counterparts yet.`}
        descriptionLine2={t(i18n)`Create your first counterpart.`}
        actionButtonLabel={t(i18n)`Create new`}
        actionOptions={[t(i18n)`Counterpart`]}
        onAction={() => {
          openModal?.(true);
        }}
        type="no-data"
      />
    );
  }

  return (
    <Box
      className={classNames(ScopedCssBaselineContainerClassName, className)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: 'inherit',
        minHeight: '500px',
      }}
    >
      <FiltersComponent
        onChangeFilter={onChangeFilter}
        showCategories={showCategories}
        sx={{ mb: 2 }}
      />
      <DataGrid
        rowSelection={false}
        disableColumnFilter={true}
        initialState={{
          sorting: {
            sortModel: sortModel && [sortModel],
          },
          columns: {
            columnVisibilityModel: {
              category: showCategories,
            },
          },
        }}
        onSortModelChange={onChangeSort}
        loading={isLoading}
        rowHeight={60}
        onRowClick={(params) => {
          if (!hasSelectedText()) {
            onRowClick?.(params.row.id);
          }
        }}
        columnVisibilityModel={{
          category: showCategories,
        }}
        slots={{
          pagination: () => (
            <TablePagination
              pageSizeOptions={componentSettings.counterparts.pageSizeOptions}
              prevPage={counterparts?.prev_pagination_token}
              nextPage={counterparts?.next_pagination_token}
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
          noRowsOverlay: () => (
            <GetNoRowsOverlay
              isLoading={isLoading}
              dataLength={counterparts?.data.length || 0}
              isFiltering={isFiltering}
              isSearching={isSearching}
              isError={isError}
              onCreate={() => {
                openModal?.(true);
              }}
              refetch={refetch}
              entityName={t(i18n)`Counterpart`}
              actionButtonLabel={t(i18n)`Create new`}
              type="no-data"
            />
          ),
        }}
        columns={columns}
        rows={counterparts?.data || []}
      />
    </Box>
  );
};
