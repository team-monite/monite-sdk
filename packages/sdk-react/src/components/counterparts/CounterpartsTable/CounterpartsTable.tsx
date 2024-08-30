import { useCallback, useEffect, useMemo, useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import type { CounterpartShowCategories } from '@/components/counterparts/Counterpart.types';
import { CounterpartStatusChip } from '@/components/counterparts/CounterpartStatusChip';
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
import { CounterPartCellByName } from '@/ui/CounterpartCell/CounterpartCell';
import { DataGridEmptyState } from '@/ui/DataGridEmptyState';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { LoadingPage } from '@/ui/loadingPage';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Button,
  createSvgIcon,
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

import { getCounterpartName } from '../helpers';
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
          return (
            <CounterPartCellByName name={getCounterpartName(counterpart)} />
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
        headerName: t(i18n)`Contact information`,
        renderCell: (params) => {
          const counterpart = params.row;

          const { email, phone } =
            'organization' in counterpart
              ? counterpart.organization
              : counterpart.individual;

          return (
            <Stack spacing={0.5} direction="column">
              {email && (
                <Styled.MuiColContacts>
                  <EmailIcon />
                  <Typography variant="body2">{email}</Typography>
                </Styled.MuiColContacts>
              )}
              {phone && (
                <Styled.MuiColContacts>
                  <PhoneIcon />
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
          noRowsOverlay: () => (
            <GetNoRowsOverlay
              isLoading={isLoading}
              dataLength={counterparts?.data.length || 0}
              isFiltering={isFiltering}
              isSearching={isSearching}
              isError={isError}
              onCreate={(action) => {
                if (!setType) return;
                if (action === t(i18n)`Organization`) {
                  setType('organization');
                } else if (action === t(i18n)`Individual`) {
                  setType('individual');
                }
              }}
              refetch={refetch}
              entityName={t(i18n)`Counterpart`}
              actionButtonLabel={t(i18n)`Create new`}
              actionOptions={[t(i18n)`Organization`, t(i18n)`Individual`]}
              type="no-data"
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

const EmailIcon = createSvgIcon(
  <svg
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.3333 2.66699H4C3.46957 2.66699 2.96086 2.87771 2.58579 3.25278C2.21071 3.62785 2 4.13656 2 4.66699V11.3337C2 11.8641 2.21071 12.3728 2.58579 12.7479C2.96086 13.1229 3.46957 13.3337 4 13.3337H13.3333C13.8638 13.3337 14.3725 13.1229 14.7475 12.7479C15.1226 12.3728 15.3333 11.8641 15.3333 11.3337V4.66699C15.3333 4.13656 15.1226 3.62785 14.7475 3.25278C14.3725 2.87771 13.8638 2.66699 13.3333 2.66699ZM13.06 4.00033L9.14 7.92033C9.07802 7.98281 9.00429 8.03241 8.92305 8.06625C8.84181 8.1001 8.75467 8.11752 8.66667 8.11752C8.57866 8.11752 8.49152 8.1001 8.41028 8.06625C8.32904 8.03241 8.25531 7.98281 8.19333 7.92033L4.27333 4.00033H13.06ZM14 11.3337C14 11.5105 13.9298 11.68 13.8047 11.8051C13.6797 11.9301 13.5101 12.0003 13.3333 12.0003H4C3.82319 12.0003 3.65362 11.9301 3.5286 11.8051C3.40357 11.68 3.33333 11.5105 3.33333 11.3337V4.94033L7.25333 8.86033C7.62833 9.23486 8.13666 9.44523 8.66667 9.44523C9.19667 9.44523 9.705 9.23486 10.08 8.86033L14 4.94033V11.3337Z"
      fill="black"
    />
  </svg>,
  // eslint-disable-next-line lingui/no-unlocalized-strings
  'Email Icon'
);

const PhoneIcon = createSvgIcon(
  <svg
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.3131 5.99959C14.445 5.99959 14.5739 5.96049 14.6835 5.88723C14.7932 5.81398 14.8786 5.70986 14.9291 5.58804C14.9795 5.46623 14.9927 5.33218 14.967 5.20286C14.9413 5.07354 14.8778 4.95475 14.7846 4.86152C14.6913 4.76828 14.5725 4.70479 14.4432 4.67906C14.3139 4.65334 14.1798 4.66654 14.058 4.717C13.9362 4.76746 13.8321 4.85291 13.7588 4.96254C13.6856 5.07217 13.6465 5.20107 13.6465 5.33292C13.6465 5.50973 13.7167 5.6793 13.8417 5.80432C13.9668 5.92935 14.1363 5.99959 14.3131 5.99959ZM12.3131 5.99959C12.445 5.99959 12.5739 5.96049 12.6835 5.88723C12.7932 5.81398 12.8786 5.70986 12.9291 5.58804C12.9795 5.46623 12.9927 5.33218 12.967 5.20286C12.9413 5.07354 12.8778 4.95475 12.7846 4.86152C12.6913 4.76828 12.5725 4.70479 12.4432 4.67906C12.3139 4.65334 12.1798 4.66654 12.058 4.717C11.9362 4.76746 11.8321 4.85291 11.7588 4.96254C11.6856 5.07217 11.6465 5.20107 11.6465 5.33292C11.6465 5.50973 11.7167 5.6793 11.8417 5.80432C11.9668 5.92935 12.1363 5.99959 12.3131 5.99959ZM10.3131 5.99959C10.445 5.99959 10.5739 5.96049 10.6835 5.88723C10.7932 5.81398 10.8786 5.70986 10.9291 5.58804C10.9795 5.46623 10.9927 5.33218 10.967 5.20286C10.9413 5.07354 10.8778 4.95475 10.7846 4.86152C10.6913 4.76828 10.5725 4.70479 10.4432 4.67906C10.3139 4.65334 10.1798 4.66654 10.058 4.717C9.93621 4.76746 9.83209 4.85291 9.75883 4.96254C9.68558 5.07217 9.64648 5.20107 9.64648 5.33292C9.64648 5.42047 9.66372 5.50716 9.69723 5.58804C9.73073 5.66893 9.77984 5.74242 9.84174 5.80432C9.90365 5.86623 9.97714 5.91534 10.058 5.94884C10.1389 5.98234 10.2256 5.99959 10.3131 5.99959ZM13.2731 8.66625C13.1265 8.66625 12.9731 8.61959 12.8265 8.58625C12.5295 8.5208 12.2376 8.43391 11.9531 8.32625C11.6439 8.21374 11.3039 8.21958 10.9987 8.34266C10.6935 8.46573 10.4445 8.69734 10.2998 8.99292L10.1531 9.29292C9.50282 8.93014 8.90414 8.48169 8.37315 7.95959C7.8536 7.42887 7.40538 6.83274 7.03981 6.18625L7.33315 5.99959C7.62872 5.85486 7.86033 5.60594 7.98341 5.30071C8.10648 4.99549 8.11233 4.65553 7.99981 4.34625C7.89396 4.0612 7.8071 3.76945 7.73981 3.47292C7.70648 3.31959 7.67981 3.17292 7.65981 3.01959C7.57886 2.55 7.3329 2.12475 6.96623 1.82041C6.59956 1.51608 6.13628 1.35266 5.65981 1.35959H3.65981C3.37798 1.35922 3.09925 1.41842 2.84189 1.53331C2.58454 1.6482 2.35437 1.81619 2.16648 2.02625C1.97561 2.24125 1.83333 2.49487 1.74934 2.76983C1.66536 3.0448 1.64164 3.33463 1.67981 3.61959C2.03095 6.41095 3.3014 9.00597 5.29075 10.9953C7.28009 12.9847 9.87512 14.2551 12.6665 14.6063C12.753 14.6129 12.8399 14.6129 12.9265 14.6063C13.4569 14.6063 13.9656 14.3955 14.3407 14.0205C14.7158 13.6454 14.9265 13.1367 14.9265 12.6063V10.6063C14.9196 10.1411 14.7507 9.69284 14.4489 9.33875C14.1471 8.98465 13.7314 8.74684 13.2731 8.66625ZM13.5998 12.6663C13.6009 12.7629 13.581 12.8586 13.5414 12.9468C13.5018 13.0349 13.4436 13.1135 13.3706 13.1769C13.2977 13.2403 13.2119 13.2871 13.1191 13.314C13.0263 13.341 12.9287 13.3474 12.8331 13.3329C10.3439 13.0081 8.03121 11.8717 6.25315 10.0996C4.47648 8.30949 3.34198 5.98188 3.02648 3.47959C3.012 3.38181 3.01944 3.28204 3.04826 3.18749C3.07709 3.09294 3.12658 3.00599 3.19315 2.93292C3.25487 2.86264 3.3307 2.80614 3.41569 2.76709C3.50069 2.72804 3.59295 2.70731 3.68648 2.70625H5.68648C5.84151 2.7028 5.9929 2.75351 6.11458 2.84963C6.23626 2.94576 6.32062 3.0813 6.35315 3.23292C6.37981 3.41514 6.41315 3.59514 6.45315 3.77292C6.53016 4.12435 6.63265 4.46971 6.75981 4.80625L5.82648 5.23959C5.74668 5.2762 5.67489 5.32822 5.61525 5.39265C5.55561 5.45708 5.50928 5.53266 5.47893 5.61505C5.44857 5.69744 5.43479 5.78501 5.43838 5.87273C5.44196 5.96046 5.46284 6.04662 5.49981 6.12625C6.45928 8.18142 8.11131 9.83345 10.1665 10.7929C10.3288 10.8596 10.5108 10.8596 10.6731 10.7929C10.8386 10.7313 10.9728 10.6067 11.0465 10.4463L11.4665 9.51292C11.8111 9.63617 12.1629 9.73858 12.5198 9.81959C12.6931 9.85959 12.8798 9.89292 13.0598 9.91959C13.2102 9.95345 13.3442 10.0384 13.439 10.1599C13.5338 10.2815 13.5836 10.4321 13.5798 10.5863L13.5998 12.6663Z"
      fill="black"
    />
  </svg>,
  // eslint-disable-next-line lingui/no-unlocalized-strings
  'Phone Icon'
);
