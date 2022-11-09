import React, { useEffect, useState } from 'react';
import { formatISO, addDays, format } from 'date-fns';
import {
  api__v1__payables__pagination__CursorFields,
  OrderEnum,
  PayableStateEnum,
  ReceivableResponse,
} from '@team-monite/sdk-api';
import {
  Button,
  HeadCellSort,
  SortOrderEnum,
  Table,
  TableFooter,
  Tag,
  UArrowLeft,
  UArrowRight,
} from '@team-monite/ui-kit-react';

import { usePayable } from 'core/queries/usePayable';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { default as FiltersComponent } from './Filters';
import { Sort, FilterTypes, FilterValue } from './types';
import { MONITE_ENTITY_ID, PAGE_LIMIT } from '../../../constants';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_DUE_DATE,
  FILTER_TYPE_STATUS,
} from './consts';
import { ROW_TO_TAG_STATUS_MAP } from '../consts';
import * as Styled from './styles';

interface Props {
  onRowClick?: (id: string) => void;
  onChangeSort?: (params: {
    sort: api__v1__payables__pagination__CursorFields;
    order: SortOrderEnum | null;
  }) => void;
  onChangeFilter?: (filter: {
    field: keyof FilterTypes;
    value: FilterValue;
  }) => void;
}

const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

const PayablesTable = ({
  onRowClick,
  onChangeSort: onChangeSortCallback,
  onChangeFilter: onChangeFilterCallback,
}: Props) => {
  const { t } = useComponentsContext();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [currentSort, setCurrentSort] = useState<Sort | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterTypes>({});

  const {
    data: payables,
    isLoading,
    isRefetching,
    refetch,
  } = usePayable(
    MONITE_ENTITY_ID,
    currentSort ? (currentSort.order as unknown as OrderEnum) : undefined,
    PAGE_LIMIT,
    currentPaginationToken || undefined,
    currentSort ? currentSort.sort : undefined,
    undefined,
    undefined,
    // HACK: api filter parameter 'created_at' requires full match with seconds. Could not be used
    currentFilter[FILTER_TYPE_CREATED_AT]
      ? formatISO(addDays(currentFilter[FILTER_TYPE_CREATED_AT] as Date, 1))
      : undefined,
    currentFilter[FILTER_TYPE_CREATED_AT]
      ? formatISO(currentFilter[FILTER_TYPE_CREATED_AT] as Date)
      : undefined,
    undefined,
    currentFilter[FILTER_TYPE_STATUS] || undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    currentFilter[FILTER_TYPE_DUE_DATE]
      ? formatISO(currentFilter[FILTER_TYPE_DUE_DATE] as Date)
      : undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    currentFilter[FILTER_TYPE_SEARCH] || undefined
  );

  useEffect(() => {
    refetch();
  }, [currentPaginationToken, currentSort, currentFilter]);

  const onPrev = () =>
    setCurrentPaginationToken(payables?.prev_pagination_token || null);

  const onNext = () =>
    setCurrentPaginationToken(payables?.next_pagination_token || null);

  const onChangeSort = (
    sort: api__v1__payables__pagination__CursorFields,
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

  const onChangeFilter = (field: keyof FilterTypes, value: FilterValue) => {
    setCurrentPaginationToken(null);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value === 'all' ? null : value,
    }));

    onChangeFilterCallback && onChangeFilterCallback({ field, value });
  };

  return (
    <Styled.Table>
      <FiltersComponent onChangeFilter={onChangeFilter} />
      <Table
        loading={isLoading || isRefetching}
        rowKey="id"
        columns={[
          {
            title: t('payables:columns.invoice'),
            dataIndex: 'document_id',
            key: 'document_id',
          },
          {
            title: t('payables:columns.supplier'),
            // TODO: Here we should use the counterpart logo picture url
            dataIndex: 'counterpart_name',
            key: 'counterpart_name',
          },
          {
            title: t('payables:columns.invoiceDate'),
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
                  api__v1__payables__pagination__CursorFields.DUE_DATE
                }
                title={t('payables:columns.dueDate')}
                onChangeOrder={(order) =>
                  onChangeSort(
                    api__v1__payables__pagination__CursorFields.DUE_DATE,
                    order
                  )
                }
              />
            ),
            dataIndex: 'due_date',
            key: 'due_date',
            render: (value: string) =>
              value ? value.split('-').reverse().join('.') : '',
          },
          {
            title: t('payables:columns.status'),
            dataIndex: 'status',
            key: 'status',
            render: (value: PayableStateEnum) => (
              <Tag color={ROW_TO_TAG_STATUS_MAP[value]}>{value}</Tag>
            ),
          },
          {
            title: (
              <HeadCellSort
                isActive={
                  currentSort?.sort ===
                  api__v1__payables__pagination__CursorFields.AMOUNT
                }
                title={t('payables:columns.amount')}
                onChangeOrder={(order) =>
                  onChangeSort(
                    api__v1__payables__pagination__CursorFields.AMOUNT,
                    order
                  )
                }
              />
            ),
            dataIndex: 'amount',
            key: 'amount',
            render: (value: number | undefined) =>
              value ? formatter.format(value) : '',
          },
          // {
          //   title: t('payables:columns.addedBy'),
          //   // TODO: Here we should use an Avatar with User name instead of user_id
          //   dataIndex: 'was_created_by_user_id',
          //   key: 'was_created_by_user_id',
          //   render: (value: string | undefined) => (
          //     <Avatar size={24} textSize="regular">
          //       {value}
          //     </Avatar>
          //   ),
          // },
        ]}
        data={payables?.data}
        onRow={(record) => ({
          onClick: () =>
            onRowClick && onRowClick((record as ReceivableResponse).id),
        })}
        scroll={{ y: 'auto' }}
        // TODO create footer component and move to UI
        footer={() => (
          <TableFooter>
            <Button
              variant="contained"
              color="secondary"
              onClick={onPrev}
              disabled={!payables?.prev_pagination_token}
            >
              <UArrowLeft width={24} height={24} />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={onNext}
              disabled={!payables?.next_pagination_token}
            >
              <UArrowRight width={24} height={24} />
            </Button>
          </TableFooter>
        )}
      />
    </Styled.Table>
  );
};

export default PayablesTable;
