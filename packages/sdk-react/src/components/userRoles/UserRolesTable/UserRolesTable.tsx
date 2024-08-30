import { useMemo, useState } from 'react';

import { components } from '@/api';
import { FILTER_TYPE_CREATED_AT } from '@/components/approvalPolicies/consts';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { FILTER_TYPE_SEARCH } from '@/components/userRoles/consts';
import { FilterType, FilterValue } from '@/components/userRoles/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { DataGridEmptyState } from '@/ui/DataGridEmptyState';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { LoadingPage } from '@/ui/loadingPage';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { useDateFormat } from '@/utils/MoniteOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';
import {
  DataGrid,
  gridClasses,
  GridColDef,
  GridSortModel,
} from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { addDays, formatISO } from 'date-fns';

import { Filters } from './Filters';
import { PermissionsCell } from './PermissionsCell';

interface UserRolesTableProps {
  /**
   * Triggered when the filtering options are changed.
   * Sync with the server *is* performed.
   *
   * @param filter - An object containing the filter parameters.
   * @param filter.field - The field to filter by, specified as a keyof FilterTypes.
   * @param filter.value - The value to be applied to the filter, of type FilterValue.
   */
  onFilterChanged?: (filter: {
    field: keyof FilterType;
    value: FilterValue;
  }) => void;

  /**
   * Triggered when the sorting options are changed.
   * Sync with the server *is* performed.
   *
   * @param params - An object containing the sorting parameters.
   * @param params.sort - The field to sort by, in this case PayableCursorFields.CREATED_AT.
   * @param params.order - The sort order can be either SortOrderEnum values or null.
   */
  onSortChanged?: (params: UserRolesTableSortModel) => void;
  /**
   * Triggered when a row is clicked.
   *
   * @param id - The id of the row that was clicked.
   */
  onRowClick?: (id: string) => void;

  /**
   * Triggered when the create button is clicked for no data state
   */
  handleCreateNew?: () => void;
}

interface UserRolesTableSortModel {
  field: components['schemas']['RoleCursorFields'];
  sort: NonNullable<GridSortDirection>;
}

export const UserRolesTable = (props: UserRolesTableProps) => (
  <MoniteScopedProviders>
    <UserRolesTableBase {...props} />
  </MoniteScopedProviders>
);

const UserRolesTableBase = ({
  onFilterChanged,
  onSortChanged,
  onRowClick,
  handleCreateNew,
}: UserRolesTableProps) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );
  const [currentFilter, setCurrentFilter] = useState<FilterType>({});
  const [sortModel, setSortModel] = useState<UserRolesTableSortModel>({
    field: 'created_at',
    sort: 'desc',
  });

  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadSupported, isLoading: isReadSupportedLoading } =
    useIsActionAllowed({
      method: 'role',
      action: 'read',
      entityUserId: user?.id,
    });

  const {
    data: roles,
    isLoading,
    isError,
    refetch,
  } = api.roles.getRoles.useQuery({
    query: {
      sort: sortModel?.field,
      order: sortModel?.sort,
      limit: pageSize,
      pagination_token: currentPaginationToken || undefined,
      name: currentFilter[FILTER_TYPE_SEARCH] || undefined,
      created_at__gte: currentFilter[FILTER_TYPE_CREATED_AT]
        ? formatISO(currentFilter[FILTER_TYPE_CREATED_AT] as Date)
        : undefined,
      created_at__lte: currentFilter[FILTER_TYPE_CREATED_AT]
        ? formatISO(addDays(currentFilter[FILTER_TYPE_CREATED_AT] as Date, 1))
        : undefined,
    },
  });

  const onChangeFilter = (field: keyof FilterType, value: FilterValue) => {
    setCurrentPaginationToken(null);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value,
    }));

    onFilterChanged?.({ field, value });
  };

  const onChangeSort = (model: GridSortModel) => {
    setSortModel(model[0] as UserRolesTableSortModel);
    setCurrentPaginationToken(null);

    onSortChanged?.(model[0] as UserRolesTableSortModel);
  };

  const dateFormat = useDateFormat();

  const columns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'name',
        headerName: t(i18n)`Name`,
        sortable: false,
        flex: 1,
      },
      {
        field: 'permissions',
        headerName: t(i18n)`Permissions`,
        sortable: false,
        flex: 2,
        renderCell: (params) => (
          <PermissionsCell
            permissions={params.value}
            onCLickSeeAll={() => onRowClick?.(params.row.id)}
          />
        ),
      },
      {
        field: 'created_at',
        headerName: t(i18n)`Created on`,
        sortable: true,
        type: 'date',
        flex: 1,
        valueFormatter: (
          value: components['schemas']['PayableResponseSchema']['created_at']
        ) => i18n.date(value, dateFormat),
      },
    ];
  }, [dateFormat, i18n, onRowClick]);

  if (isReadSupportedLoading) {
    return <LoadingPage />;
  }

  if (!isReadSupported) {
    return <AccessRestriction />;
  }

  const isFiltering = Object.keys(currentFilter).some(
    (key) =>
      currentFilter[key as keyof FilterType] !== null &&
      currentFilter[key as keyof FilterType] !== undefined
  );
  const isSearching = !!currentFilter[FILTER_TYPE_SEARCH];

  if (!isLoading && roles?.data.length === 0 && !isFiltering && !isSearching) {
    return (
      <DataGridEmptyState
        title={t(i18n)`No Roles`}
        descriptionLine1={t(i18n)`You don’t have any roles yet.`}
        descriptionLine2={t(i18n)`You can create your first role.`}
        actionButtonLabel={t(i18n)`Create new`}
        actionOptions={[t(i18n)`Role`]}
        onAction={() => {
          handleCreateNew?.();
        }}
        type="no-data"
      />
    );
  }

  return (
    <Box
      className={ScopedCssBaselineContainerClassName}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: 'inherit',
        pt: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Filters onChangeFilter={onChangeFilter} />
      </Box>
      <DataGrid
        initialState={{
          sorting: {
            sortModel: [sortModel],
          },
        }}
        rowSelection={false}
        disableColumnFilter={true}
        loading={isLoading}
        columns={columns}
        rows={roles?.data || []}
        onSortModelChange={onChangeSort}
        onRowClick={(params) => onRowClick?.(params.row.id)}
        getRowHeight={() => 'auto'}
        sx={{
          [`& .${gridClasses.cell}`]: {
            py: 1,
          },
        }}
        slots={{
          pagination: () => (
            <TablePagination
              prevPage={roles?.prev_pagination_token}
              nextPage={roles?.next_pagination_token}
              paginationModel={{
                pageSize,
                page: currentPaginationToken,
              }}
              onPaginationModelChange={({ page, pageSize }) => {
                setCurrentPaginationToken(page);
                setPageSize(pageSize);
              }}
            />
          ),
          noRowsOverlay: () => (
            <GetNoRowsOverlay
              isLoading={isLoading}
              dataLength={roles?.data.length || 0}
              isFiltering={isFiltering}
              isSearching={isSearching}
              isError={isError}
              onCreate={() => handleCreateNew?.()}
              refetch={refetch}
              entityName={t(i18n)`Roles`}
              actionButtonLabel={t(i18n)`Create new`}
              actionOptions={[t(i18n)`Role`]}
              type="no-data"
            />
          ),
        }}
      />
    </Box>
  );
};
