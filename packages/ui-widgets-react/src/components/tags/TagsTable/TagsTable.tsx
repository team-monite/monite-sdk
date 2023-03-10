import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import styled from '@emotion/styled';
import {
  Button,
  DropdownMenuItem,
  HeadCellSort,
  SortOrderEnum,
  Table,
  TableFooter,
  UArrowLeft,
  UArrowRight,
  useModal,
} from '@team-monite/ui-kit-react';
import { UserCell } from './UserCell';
import { TagFormModal } from '../TagFormModal';
import { ConfirmDeleteModal } from '../ConfirmDeleteModal';
import {
  TagCursorFields,
  OrderEnum,
  TagReadSchema,
} from '@team-monite/sdk-api';

import { useComponentsContext } from 'core/context/ComponentsContext';
import { useTagList } from 'core/queries';

import { Sort } from './types';

export const StyledWrapper = styled.div<{
  children: React.ReactNode;
  clickableRow?: boolean;
}>`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;

  // for fixed header
  .rc-table,
  .rc-table-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .rc-table-body {
    flex: 1 1 0;
  }

  td {
    vertical-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

interface Props {
  onChangeSort?: (params: {
    sort: TagCursorFields;
    order: SortOrderEnum | null;
  }) => void;
}
const TagsTable = ({ onChangeSort: onChangeSortCallback }: Props) => {
  const { t } = useComponentsContext();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [currentSort, setCurrentSort] = useState<Sort | null>(null);
  const {
    show: showEdit,
    hide: hideEdit,
    isOpen: isOpenEdit,
    entity: tagToEdit,
  } = useModal<TagReadSchema>();
  const {
    show: showDelete,
    hide: hideDelete,
    isOpen: isOpenDelete,
    entity: tagToDelete,
  } = useModal<TagReadSchema>();

  const { data: tags, isLoading } = useTagList(
    currentSort ? (currentSort.order as unknown as OrderEnum) : undefined,
    10,
    currentPaginationToken || undefined,
    currentSort ? currentSort.sort : undefined
  );

  useEffect(() => {
    if (currentPaginationToken && tags?.data.length === 0) {
      setCurrentPaginationToken(null);
    }
  }, [tags]);

  const onPrev = () =>
    setCurrentPaginationToken(tags?.prev_pagination_token || null);

  const onNext = () =>
    setCurrentPaginationToken(tags?.next_pagination_token || null);

  const onChangeSort = (sort: TagCursorFields, order: SortOrderEnum | null) => {
    setCurrentPaginationToken(null);
    if (order) {
      setCurrentSort({
        sort,
        order,
      });
    } else if (currentSort?.sort === sort && order === null) {
      setCurrentSort(null);
    }

    onChangeSortCallback && onChangeSortCallback({ sort, order });
  };

  return (
    <StyledWrapper>
      <Table
        loading={isLoading}
        rowKey="id"
        columns={[
          {
            title: t('tags:columns.name'),
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: (
              <HeadCellSort
                isActive={currentSort?.sort === TagCursorFields.CREATED_AT}
                title={t('tags:columns.createdAt')}
                onChangeOrder={(order) =>
                  onChangeSort(TagCursorFields.CREATED_AT, order)
                }
              />
            ),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value: string) =>
              value ? format(new Date(value), 'dd.MM.yyyy') : '',
          },
          {
            title: (
              <HeadCellSort
                isActive={currentSort?.sort === TagCursorFields.UPDATED_AT}
                title={t('tags:columns.updatedAt')}
                onChangeOrder={(order) =>
                  onChangeSort(TagCursorFields.UPDATED_AT, order)
                }
              />
            ),
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (value: string) =>
              value ? format(new Date(value), 'dd.MM.yyyy') : '',
          },
          {
            title: t('tags:columns.createdBy'),
            dataIndex: 'created_by_entity_user_id',
            key: 'created_by_entity_user_id',
            render: (value: string) => <UserCell id={value} />,
          },
        ]}
        data={tags?.data}
        renderDropdownActions={(tag: TagReadSchema) => (
          <>
            <DropdownMenuItem onClick={() => showEdit(tag)}>
              {t('tags:actions.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => showDelete(tag)}>
              {t('tags:actions.delete')}
            </DropdownMenuItem>
          </>
        )}
        scroll={{ y: 'auto' }}
        footer={() => (
          <TableFooter>
            <Button
              variant="contained"
              color="secondary"
              onClick={onPrev}
              aria-label="previous"
              disabled={!tags?.prev_pagination_token}
            >
              <UArrowLeft width={24} height={24} />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={onNext}
              aria-label="next"
              disabled={!tags?.next_pagination_token}
            >
              <UArrowRight width={24} height={24} />
            </Button>
          </TableFooter>
        )}
      />
      {isOpenEdit && tagToEdit && (
        <TagFormModal
          onClose={hideEdit}
          tag={{ id: tagToEdit.id, name: tagToEdit.name }}
        />
      )}
      {isOpenDelete && tagToDelete && (
        <ConfirmDeleteModal
          onClose={hideDelete}
          onDelete={hideDelete}
          tag={{ id: tagToDelete.id, name: tagToDelete.name }}
        />
      )}
    </StyledWrapper>
  );
};

export default TagsTable;
