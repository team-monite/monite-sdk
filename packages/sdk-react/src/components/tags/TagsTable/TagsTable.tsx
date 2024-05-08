import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { UserCell } from '@/components/tags/TagsTable/UserCell/UserCell';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useEntityUserByAuthToken, useTagList } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  TagCursorFields,
  OrderEnum,
  TagReadSchema,
  ActionEnum,
} from '@monite/sdk-api';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridSortModel,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { ConfirmDeleteModal } from '../ConfirmDeleteModal';
import { TagFormModal } from '../TagFormModal';

interface TagsTableProps {
  onChangeSort?: (params: TagsTableSortModel) => void;
}

interface TagsTableSortModel {
  field: TagCursorFields;
  sort: GridSortDirection;
}

export const TagsTable = (props: TagsTableProps) => (
  <MoniteScopedProviders>
    <TagsTableBase {...props} />
  </MoniteScopedProviders>
);

const TagsTableBase = ({
  onChangeSort: onChangeSortCallback,
}: TagsTableProps) => {
  const { i18n } = useLingui();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );
  const [selectedTag, setSelectedTag] = useState<TagReadSchema | undefined>(
    undefined
  );
  const [sortModels, setSortModels] = useState<Array<TagsTableSortModel>>([]);
  const sortModel = sortModels[0];
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

  const {
    data: tags,
    isLoading,
    isError,
    error,
  } = useTagList(
    sortModel ? (sortModel.sort as unknown as OrderEnum) : undefined,
    pageSize,
    currentPaginationToken || undefined,
    sortModel ? sortModel.field : undefined
  );

  //TODO: Remove this error handling and replace with proper error handling
  useEffect(() => {
    if (isError) {
      toast.error(error.body.error.message || error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (currentPaginationToken && tags?.data.length === 0) {
      setCurrentPaginationToken(null);
    }
  }, [currentPaginationToken, tags]);

  const onChangeSort = (m: GridSortModel) => {
    const model = m as Array<TagsTableSortModel>;
    setSortModels(model);
    setCurrentPaginationToken(null);

    onChangeSortCallback?.(model[0]);
  };

  const { data: user } = useEntityUserByAuthToken();

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'tag',
    action: ActionEnum.UPDATE,
    entityUserId: user?.id, // todo::Find a workaround to utilize `allowed_for_own`, or let it go.
  });

  const { data: isDeleteAllowed } = useIsActionAllowed({
    method: 'tag',
    action: ActionEnum.DELETE,
    entityUserId: user?.id, // todo::Find a workaround to utilize `allowed_for_own`, or let it go.
  });

  return (
    <>
      <Box
        sx={{ padding: 2, width: '100%', height: '100%' }}
        className={ScopedCssBaselineContainerClassName}
      >
        <DataGrid
          loading={isLoading}
          sortModel={sortModels}
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
          columns={[
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
              valueFormatter: ({
                value,
              }: GridValueFormatterParams<TagReadSchema['created_at']>) =>
                i18n.date(value, DateTimeFormatOptions.EightDigitDate),
            },
            {
              field: 'updated_at',
              headerName: t(i18n)`Updated at`,
              flex: 0.5,
              valueFormatter: ({
                value,
              }: GridValueFormatterParams<TagReadSchema['updated_at']>) =>
                i18n.date(value, DateTimeFormatOptions.EightDigitDate),
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
          ]}
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
    </>
  );
};
