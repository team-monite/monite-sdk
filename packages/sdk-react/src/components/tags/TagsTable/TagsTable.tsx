import React, { useState, useEffect, useCallback } from 'react';

import { UserCell } from '@/components/tags/TagsTable/UserCell/UserCell';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useTagList } from '@/core/queries';
import { TablePagination } from '@/ui/table/TablePagination';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { TagCursorFields, OrderEnum, TagReadSchema } from '@monite/sdk-api';
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

interface Props {
  onChangeSort?: (params: TagsTableSortModel) => void;
}

interface TagsTableSortModel {
  field: TagCursorFields;
  sort: GridSortDirection;
}

export const TagsTable = ({ onChangeSort: onChangeSortCallback }: Props) => {
  const { i18n } = useLingui();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
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

  const { data: tags, isInitialLoading } = useTagList(
    sortModel ? (sortModel.sort as unknown as OrderEnum) : undefined,
    10,
    currentPaginationToken || undefined,
    sortModel ? sortModel.field : undefined
  );

  useEffect(() => {
    if (currentPaginationToken && tags?.data.length === 0) {
      setCurrentPaginationToken(null);
    }
  }, [currentPaginationToken, tags]);

  const onPrev = () =>
    setCurrentPaginationToken(tags?.prev_pagination_token || null);

  const onNext = () =>
    setCurrentPaginationToken(tags?.next_pagination_token || null);

  const onChangeSort = (m: GridSortModel) => {
    const model = m as Array<TagsTableSortModel>;
    setSortModels(model);
    setCurrentPaginationToken(null);

    onChangeSortCallback?.(model[0]);
  };

  return (
    <MoniteStyleProvider>
      <Box sx={{ padding: 2, width: '100%', height: '100%' }}>
        <DataGrid
          loading={isInitialLoading}
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
                isPreviousAvailable={Boolean(tags?.prev_pagination_token)}
                isNextAvailable={Boolean(tags?.next_pagination_token)}
                onPrevious={onPrev}
                onNext={onNext}
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
              renderCell: (params) => <UserCell id={params.value} />,
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
                  label={t(i18n)`Edit`}
                />,
                <GridActionsCellItem
                  onClick={() => {
                    setSelectedTag(params.row);
                    openDeleteModal();
                  }}
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
    </MoniteStyleProvider>
  );
};
