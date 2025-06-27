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
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { TablePagination } from '@/ui/table/TablePagination';
import { hasSelectedText } from '@/utils/text-selection';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { ConfirmDeleteModal } from '../ConfirmDeleteModal';
import { getTagCategoryLabel } from '../helpers';
import { TagFormModal } from '../TagFormModal';
import { useTags } from '../useTags';

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
  const { api, locale, componentSettings } = useMoniteContext();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    componentSettings.tags.pageSizeOptions[0]
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
  const { tagsWithKeywords } = useTags({});

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
    setSelectedTag(undefined);
    setEditModalOpened(false);
    setDeleteModalOpened(false);
  }, []);

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

  const tagsList = (tags?.data ?? []).map((tag) => ({
    ...tag,
    keywords: tagsWithKeywords[tag.id]?.join(', '),
  }));

  const columns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'name',
        headerName: t(i18n)`Name`,
        sortable: false,
        flex: 1,
      },
      {
        field: 'category',
        headerName: t(i18n)`Category`,
        sortable: false,
        flex: 1,
        valueFormatter: (
          value: components['schemas']['TagReadSchema']['category']
        ) => getTagCategoryLabel(value, i18n),
      },
      {
        field: 'keywords',
        headerName: t(i18n)`Keywords`,
        sortable: false,
        flex: 1,
      },
      {
        field: 'created_at',
        headerName: t(i18n)`Created at`,
        flex: 0.5,
        valueFormatter: (
          value: components['schemas']['TagReadSchema']['created_at']
        ) => i18n.date(value, locale.dateFormat),
      },
      {
        field: 'updated_at',
        headerName: t(i18n)`Updated at`,
        flex: 0.5,
        valueFormatter: (
          value: components['schemas']['TagReadSchema']['updated_at']
        ) => i18n.date(value, locale.dateFormat),
      },
      {
        field: 'created_by_entity_user_id',
        headerName: t(i18n)`Created by`,
        flex: 0.6,
        sortable: false,
        renderCell: (params) =>
          params.value ? <UserCell id={params.value} /> : null,
      },
    ];
  }, [
    locale.dateFormat,
    i18n,
    isDeleteAllowed,
    isUpdateAllowed,
    openDeleteModal,
    openEditModal,
  ]);

  if (!isLoading && tags?.data.length === 0) {
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

  return (
    <Box
      className={ScopedCssBaselineContainerClassName}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: 'inherit',
        minHeight: '500px',
      }}
    >
      <DataGrid
        initialState={{
          sorting: {
            sortModel: [sortModel],
          },
        }}
        rowSelection={false}
        onRowClick={(params) => {
          if (!hasSelectedText()) {
            setSelectedTag(params.row);
            openEditModal();
          }
        }}
        disableColumnFilter={true}
        loading={isLoading}
        onSortModelChange={onChangeSort}
        slots={{
          pagination: () => (
            <TablePagination
              pageSizeOptions={componentSettings.tags.pageSizeOptions}
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
          noRowsOverlay: () => (
            <GetNoRowsOverlay
              isLoading={isLoading}
              dataLength={tags?.data.length || 0}
              isFiltering={false}
              isSearching={false}
              isError={isError}
              onCreate={showCreationModal}
              refetch={refetch}
              entityName={t(i18n)`Tags`}
              actionButtonLabel={t(i18n)`Create new tag`}
              actionOptions={[t(i18n)`Tag`]}
              type="no-data"
            />
          ),
        }}
        columns={columns}
        rows={tagsList}
      />
      <TagFormModal
        tag={selectedTag}
        open={editModalOpened}
        onClose={closeEditModal}
        isDeleteAllowed={isDeleteAllowed ?? false}
        onDelete={(tag: components['schemas']['TagReadSchema']) => {
          if (isDeleteAllowed) {
            setSelectedTag(tag);
            openDeleteModal();
          }
        }}
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
