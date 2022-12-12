import React, { useState } from 'react';
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
} from '@team-monite/ui-kit-react';
import {
  api__v1__tags__pagination__CursorFields,
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
    sort: api__v1__tags__pagination__CursorFields;
    order: SortOrderEnum | null;
  }) => void;
}
const TagsTable = ({ onChangeSort: onChangeSortCallback }: Props) => {
  const { t } = useComponentsContext();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [currentSort, setCurrentSort] = useState<Sort | null>(null);

  const { data: tags, isLoading } = useTagList(
    currentSort ? (currentSort.order as unknown as OrderEnum) : undefined,
    10,
    currentPaginationToken || undefined,
    currentSort ? currentSort.sort : undefined
  );

  const onPrev = () =>
    setCurrentPaginationToken(tags?.prev_pagination_token || null);

  const onNext = () =>
    setCurrentPaginationToken(tags?.next_pagination_token || null);

  const onChangeSort = (
    sort: api__v1__tags__pagination__CursorFields,
    order: SortOrderEnum | null
  ) => {
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
                isActive={
                  currentSort?.sort ===
                  api__v1__tags__pagination__CursorFields.CREATED_AT
                }
                title={t('tags:columns.createdAt')}
                onChangeOrder={(order) =>
                  onChangeSort(
                    api__v1__tags__pagination__CursorFields.CREATED_AT,
                    order
                  )
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
                isActive={
                  currentSort?.sort ===
                  api__v1__tags__pagination__CursorFields.UPDATED_AT
                }
                title={t('tags:columns.updatedAt')}
                onChangeOrder={(order) =>
                  onChangeSort(
                    api__v1__tags__pagination__CursorFields.UPDATED_AT,
                    order
                  )
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
          },
        ]}
        data={tags?.data}
        renderDropdownActions={(tag: TagReadSchema) => (
          <>
            <DropdownMenuItem onClick={() => {}}>
              {t('tags:actions.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
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
              disabled={!tags?.prev_pagination_token}
            >
              <UArrowLeft width={24} height={24} />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={onNext}
              disabled={!tags?.next_pagination_token}
            >
              <UArrowRight width={24} height={24} />
            </Button>
          </TableFooter>
        )}
      />
    </StyledWrapper>
  );
};

export default TagsTable;
