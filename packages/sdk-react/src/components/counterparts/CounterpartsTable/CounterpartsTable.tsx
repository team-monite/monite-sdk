import { useCallback, useEffect, useMemo, useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import type { CounterpartShowCategories } from '@/components/counterparts/Counterpart.types';
import { TableActions } from '@/components/TableActions';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { CounterpartResponse, useEntityUserByAuthToken } from '@/core/queries';
import {
  useCounterpartList,
  useDeleteCounterpart,
} from '@/core/queries/useCounterpart';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { DataGridEmptyState } from '@/ui/DataGridEmptyState';
import { LoadingPage } from '@/ui/loadingPage';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import MuiEnvelopeIcon from '@mui/icons-material/Email';
import MuiPhoneIcon from '@mui/icons-material/LocalPhone';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { getCounterpartName, getIndividualName } from '../helpers';
import {
  FILTER_TYPE_IS_CUSTOMER,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
} from './consts';
import { Filters as FiltersComponent } from './Filters';
import * as Styled from './styles';
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
   * Callback function that is called when the edit action is triggered.
   * @param id - The ID of the counterpart to be edited.
   */
  onEdit?: (id: string) => void;

  /**
   * Callback function that is called when the delete action is triggered.
   * @param id - The ID of the counterpart to be deleted.
   */
  onDelete?: (id: string) => void;

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

  /**
   * Callback function that is called when the type is changed for action button no data state.
   * @param type - The type to filter with.
   */
  setType?: (type: components['schemas']['CounterpartType']) => void;
};

export const CounterpartsTable = (props: CounterpartsTableProps) => (
  <MoniteScopedProviders>
    <CounterpartsTableBase {...props} />
  </MoniteScopedProviders>
);

const CounterpartsTableBase = ({
  onRowClick,
  onEdit,
  onDelete,
  onChangeSort: onChangeSortCallback,
  onChangeFilter: onChangeFilterCallback,
  showCategories = true,
  setType,
}: CounterpartsTableProps) => {
  const { i18n } = useLingui();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedCounterpart, setSelectedCounterpart] = useState<
    CounterpartResponse | undefined
  >(undefined);

  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
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
  const { data: isUpdateSupported } = useIsActionAllowed({
    method: 'counterpart',
    action: 'update',
    entityUserId: user?.id,
  });
  const { data: isDeleteSupported } = useIsActionAllowed({
    method: 'counterpart',
    action: 'delete',
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

  const closeDeleteCounterpartModal = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);
  const closedDeleteCounterpartModal = useCallback(() => {
    setSelectedCounterpart(undefined);
  }, []);

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

  const deleteCounterpartMutation = useDeleteCounterpart();
  const deleteCounterpart = useCallback(() => {
    if (!selectedCounterpart) {
      return;
    }

    deleteCounterpartMutation.mutate(
      {
        path: {
          counterpart_id: selectedCounterpart.id,
        },
      },
      {
        onSuccess: () => {
          onDelete?.(selectedCounterpart.id);
          closeDeleteCounterpartModal();
        },
      }
    );
  }, [
    selectedCounterpart,
    deleteCounterpartMutation,
    onDelete,
    closeDeleteCounterpartModal,
  ]);

  const { root } = useRootElements();

  const columns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'counterpart_name',
        sortable: true,
        headerName: t(i18n)`Name, country, city`,
        display: 'flex',
        flex: 1,
        renderCell: (params) => {
          const counterpart = params.row;

          const name =
            'organization' in counterpart
              ? counterpart.organization.legal_name
              : getIndividualName(counterpart.individual);

          return (
            <>
              <Avatar sx={{ marginRight: 2 }}>{name[0]}</Avatar>
              <Typography variant="caption">{name}</Typography>
            </>
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

          const items = [
            {
              label: t(i18n)`Customer`,
              value: is_customer,
            },
            { label: t(i18n)`Vendor`, value: is_vendor },
          ].map(
            ({ label, value }) =>
              value && (
                <Chip
                  key={label}
                  label={label}
                  variant="outlined"
                  color="default"
                />
              )
          );

          return (
            <Stack direction="row" spacing={1}>
              {items}
            </Stack>
          );
        },
      },
      {
        field: 'contacts',
        sortable: false,
        flex: 1,
        display: 'flex',
        headerName: t(i18n)`Contact information`,
        renderCell: (params) => {
          const counterpart = params.row;

          const { email, phone } =
            'organization' in counterpart
              ? counterpart.organization
              : counterpart.individual;

          return (
            <Stack spacing={1} direction="column">
              {email && (
                <Styled.MuiColContacts>
                  <MuiEnvelopeIcon fontSize="small" color="disabled" />
                  <Typography variant="body2">{email}</Typography>
                </Styled.MuiColContacts>
              )}
              {phone && (
                <Styled.MuiColContacts>
                  <MuiPhoneIcon fontSize="small" color="disabled" />
                  <Typography variant="body2">{phone}</Typography>
                </Styled.MuiColContacts>
              )}
            </Stack>
          );
        },
      },
      {
        field: 'actions',
        sortable: false,
        headerName: '',
        width: 70,
        renderCell: (params) => (
          <TableActions
            permissions={{
              isUpdateAllowed: isUpdateSupported,
              isDeleteAllowed: isDeleteSupported,
            }}
            onEdit={() => {
              onEdit?.(params.row.id);
            }}
            onDelete={() => {
              setSelectedCounterpart(params.row);
              setIsDeleteDialogOpen(true);
            }}
          />
        ),
      },
    ];
  }, [i18n, isDeleteSupported, isUpdateSupported, onEdit]);

  if (isReadSupportedLoading) {
    return <LoadingPage />;
  }

  if (!isReadSupported) {
    return <AccessRestriction />;
  }

  if (!isLoading && counterparts?.data.length === 0) {
    return (
      <DataGridEmptyState
        title={t(i18n)`No Counterparts`}
        descriptionLine1={t(i18n)`You don’t have any counterparts yet.`}
        descriptionLine2={t(i18n)`You can create your first counterpart.`}
        actionOptions={[t(i18n)`Organization`, t(i18n)`Individual`]}
        actionButtonLabel={t(i18n)`Create new`}
        onAction={(action) => {
          if (!setType) return;
          if (action === t(i18n)`Organization`) {
            setType('organization');
          } else if (action === t(i18n)`Individual`) {
            setType('individual');
          }
        }}
        type="no-data"
      />
    );
  }

  if (isError) {
    return (
      <DataGridEmptyState
        title={t(i18n)`Failed to Load Counterparts`}
        descriptionLine1={t(i18n)`There was an error loading counterparts.`}
        descriptionLine2={t(i18n)`Please try again later.`}
        actionButtonLabel={t(i18n)`Reload`}
        onAction={() => refetch()}
        type="error"
      />
    );
  }

  const className = 'Monite-CounterpartsTable';

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
      <Box sx={{ marginBottom: 2 }} className={className + '-FiltersContainer'}>
        <FiltersComponent
          onChangeFilter={onChangeFilter}
          showCategories={showCategories}
        />
      </Box>
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
        onRowClick={(params) => onRowClick?.(params.row.id)}
        columnVisibilityModel={{
          category: showCategories,
        }}
        sx={{
          '& .MuiDataGrid-withBorderColor': {
            borderColor: 'divider',
          },
          '&.MuiDataGrid-withBorderColor': {
            borderColor: 'divider',
          },
        }}
        slots={{
          pagination: () => (
            <TablePagination
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
        }}
        columns={columns}
        rows={counterparts?.data || []}
      />
      <Dialog
        className={className + 'Dialog-DeleteCounterpart'}
        open={isDeleteDialogOpen && Boolean(selectedCounterpart)}
        container={root}
        onClose={closeDeleteCounterpartModal}
        aria-label={t(i18n)`Delete confirmation`}
        maxWidth="sm"
        fullWidth
        TransitionProps={{
          onExited: closedDeleteCounterpartModal,
        }}
      >
        <DialogTitle
          variant="h3"
          className={className + 'Dialog-DeleteCounterpart-Title'}
        >
          {t(i18n)`Delete Counterpart "${getCounterpartName(
            selectedCounterpart!
          )}"?`}
        </DialogTitle>
        <DialogContent
          className={className + 'Dialog-DeleteCounterpart-Content'}
        >
          <DialogContentText>
            {t(i18n)`This action can't be undone.`}
          </DialogContentText>
        </DialogContent>
        <Divider className={className + 'Dialog-DeleteCounterpart-Divider'} />
        <DialogActions
          className={className + 'Dialog-DeleteCounterpart-Actions'}
        >
          <Button
            variant="outlined"
            onClick={closeDeleteCounterpartModal}
            color="inherit"
            className={className + 'Dialog-DeleteCounterpart-Actions-Cancel'}
          >
            {t(i18n)`Cancel`}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={deleteCounterpart}
            autoFocus
            className={className + 'Dialog-DeleteCounterpart-Actions-Delete'}
          >
            {t(i18n)`Delete`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
