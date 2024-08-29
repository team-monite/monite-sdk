import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { UserCell } from '@/components/tags/TagsTable/UserCell/UserCell';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { DataGridEmptyState } from '@/ui/DataGridEmptyState';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { useDateFormat } from '@/utils/MoniteOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridSortModel,
} from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { ConfirmDeleteModal } from '../ConfirmDeleteModal';
import { TagFormModal } from '../TagFormModal';

interface TagsTableProps {
  onChangeSort?: (params: TagsTableSortModel) => void;
  showCreationModal?: () => void;
}

interface TagsTableSortModel {
  field: components['schemas']['TagCursorFields'];
  sort: NonNullable<GridSortDirection>;
}

export const TagsTable = (props: TagsTableProps) => (
  <MoniteScopedProviders>
    <TagsTableBase {...props} />
  </MoniteScopedProviders>
);

const TagsTableBase = ({
  onChangeSort: onChangeSortCallback,
  showCreationModal,
}: TagsTableProps) => {
  const { i18n } = useLingui();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );
  const [selectedTag, setSelectedTag] = useState<
    components['schemas']['TagReadSchema'] | undefined
  >(undefined);
  const [sortModel, setSortModels] = useState<TagsTableSortModel>({
    field: 'created_at',
    sort: 'desc',
  });
  const [editModalOpened, setEditModalOpened] = useState<boolean>(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);

  const openEditModal = useCallback(() => {
    setEditModalOpened(true);
  }, []);
  const openDeleteModal = useCallback(() => {
    setDeleteModalOpened(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModalOpened(false);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpened(false);
  }, []);
  const { api } = useMoniteContext();

  const {
    data: tags,
    isLoading,
    isError,
    error,
    refetch,
  } = api.tags.getTags.useQuery({
    query: {
      sort: sortModel?.field,
      order: sortModel?.sort,
      limit: pageSize,
      pagination_token: currentPaginationToken ?? undefined,
    },
  });

  //TODO: Remove this error handling and replace with proper error handling
  useEffect(() => {
    if (isError) {
      toast.error(getAPIErrorMessage(i18n, error));
    }
  }, [isError, error, i18n]);

  useEffect(() => {
    if (currentPaginationToken && tags?.data.length === 0) {
      setCurrentPaginationToken(null);
    }
  }, [currentPaginationToken, tags]);

  const onChangeSort = (model: GridSortModel) => {
    setSortModels(model[0] as TagsTableSortModel);
    setCurrentPaginationToken(null);

    onChangeSortCallback?.(model[0] as TagsTableSortModel);
  };

  const { data: user } = useEntityUserByAuthToken();

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'tag',
    action: 'update',
    entityUserId: user?.id, // todo::Find a workaround to utilize `allowed_for_own`, or let it go.
  });

  const { data: isDeleteAllowed } = useIsActionAllowed({
    method: 'tag',
    action: 'delete',
    entityUserId: user?.id, // todo::Find a workaround to utilize `allowed_for_own`, or let it go.
  });

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
        field: 'created_at',
        headerName: t(i18n)`Created at`,
        flex: 0.5,
        valueFormatter: (
          value: components['schemas']['TagReadSchema']['created_at']
        ) => i18n.date(value, dateFormat),
      },
      {
        field: 'updated_at',
        headerName: t(i18n)`Updated at`,
        flex: 0.5,
        valueFormatter: (
          value: components['schemas']['TagReadSchema']['updated_at']
        ) => i18n.date(value, dateFormat),
      },
      {
        field: 'created_by_entity_user_id',
        headerName: t(i18n)`Created by`,
        flex: 0.6,
        sortable: false,
        renderCell: (params) =>
          params.value ? <UserCell id={params.value} /> : null,
      },
      {
        field: 'actions',
        type: 'actions',
        getActions: (params) => [
          <GridActionsCellItem
            onClick={() => {
              setSelectedTag(params.row);
              openEditModal();
            }}
            icon={<EditIcon />}
            disabled={!isUpdateAllowed}
            label={t(i18n)`Edit`}
          />,
          <GridActionsCellItem
            onClick={() => {
              setSelectedTag(params.row);
              openDeleteModal();
            }}
            disabled={!isDeleteAllowed}
            icon={<DeleteIcon />}
            label={t(i18n)`Delete`}
          />,
        ],
      },
    ];
  }, [
    dateFormat,
    i18n,
    isDeleteAllowed,
    isUpdateAllowed,
    openDeleteModal,
    openEditModal,
  ]);

  if (!isLoading && !tags?.data.length) {
    return (
      <DataGridEmptyState
        title={t(i18n)`No Tags`}
        descriptionLine1={t(i18n)`You don’t have any tags yet.`}
        descriptionLine2={t(i18n)`You can create your first tag.`}
        actionButtonLabel={t(i18n)`Create new tag`}
        actionOptions={[t(i18n)`Tag`]}
        onAction={(action) => {
          if (action === t(i18n)`Tag`) {
            showCreationModal?.();
          }
        }}
        type="no-data"
      />
    );
  }

  if (isError) {
    return (
      <DataGridEmptyState
        title={t(i18n)`Failed to Load Tags`}
        descriptionLine1={t(i18n)`There was an error loading tags.`}
        descriptionLine2={t(i18n)`Please try again later.`}
        actionButtonLabel={t(i18n)`Reload`}
        onAction={() => refetch()}
        type="error"
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
      <DataGrid
        initialState={{
          sorting: {
            sortModel: [sortModel],
          },
        }}
        rowSelection={false}
        disableColumnFilter={true}
        loading={isLoading}
        onSortModelChange={onChangeSort}
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
              prevPage={tags?.prev_pagination_token}
              nextPage={tags?.next_pagination_token}
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
        rows={tags?.data ?? []}
      />
      <TagFormModal
        tag={selectedTag}
        open={editModalOpened}
        onClose={closeEditModal}
      />
      {selectedTag && (
        <ConfirmDeleteModal
          tag={selectedTag}
          modalOpened={deleteModalOpened}
          onClose={closeDeleteModal}
        />
      )}
    </Box>
  );
};
