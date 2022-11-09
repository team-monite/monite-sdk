import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { TFunction } from 'react-i18next';
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
import {
  api__v1__receivables__pagination__CursorFields,
  ReceivableResponse,
  ReceivablesReceivableType,
  ReceivablesStatusEnum,
  ReceivablesOrderEnum,
} from '@team-monite/sdk-api';

import { useReceivables } from 'core/queries/useReceivables';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { MONITE_ENTITY_ID, PAGE_LIMIT } from '../../../../constants';
import { ROW_TO_TAG_STATUS_MAP } from '../../consts';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
  FILTER_TYPE_CUSTOMER,
} from '../consts';
import * as Styled from './styles';
import { FilterTypes, Sort } from '../types';

const formatter = (currency: string) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency || 'EUR',
  });

interface Props {
  type: ReceivablesReceivableType;
  currentFilters: FilterTypes;
  onChangeSort?: (
    params: {
      sort: api__v1__receivables__pagination__CursorFields;
      order: SortOrderEnum | null;
    } | null
  ) => void;
}

const mapTypeToColumns = (
  t: TFunction,
  currentSort: Sort | null,
  onChangeSort: (
    sort: api__v1__receivables__pagination__CursorFields,
    order: SortOrderEnum | null
  ) => void
) => ({
  [ReceivablesReceivableType.QUOTE]: [
    {
      title: t('receivables:columns.number'),
      dataIndex: 'document_id',
      key: 'document_id',
    },
    {
      title: t('receivables:columns.issueDate'),
      dataIndex: 'issue_date',
      key: 'issue_date',
      render: (value: string) =>
        value ? format(new Date(value), 'dd.MM.yyyy') : '',
    },
    {
      title: t('receivables:columns.customer'),
      dataIndex: 'counterpart_name',
      key: 'counterpart_name',
    },
    {
      title: t('receivables:columns.dueDate'),
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      render: (value: string) =>
        value ? value.split('-').reverse().join('.') : '',
    },
    {
      title: t('receivables:columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (value: ReceivablesStatusEnum) => (
        <Tag color={ROW_TO_TAG_STATUS_MAP[value]}>{value}</Tag>
      ),
    },
    {
      title: (
        <HeadCellSort
          isActive={
            currentSort?.sort ===
            api__v1__receivables__pagination__CursorFields.AMOUNT
          }
          title={t('receivables:columns.amount')}
          onChangeOrder={(order: SortOrderEnum | null) =>
            onChangeSort(
              api__v1__receivables__pagination__CursorFields.AMOUNT,
              order
            )
          }
        />
      ),
      dataIndex: 'total_amount',
      key: 'total_amount',
      // @ts-ignore
      render: (value: number | undefined, record: ReceivableResponse) =>
        value ? formatter(record.currency).format(value) : '',
    },
  ],
  [ReceivablesReceivableType.INVOICE]: [
    {
      title: t('receivables:columns.number'),
      dataIndex: 'document_id',
      key: 'document_id',
    },
    {
      title: t('receivables:columns.issueDate'),
      dataIndex: 'issue_date',
      key: 'issue_date',
      render: (value: string) =>
        value ? format(new Date(value), 'dd.MM.yyyy') : '',
    },
    {
      title: t('receivables:columns.customer'),
      dataIndex: 'counterpart_name',
      key: 'counterpart_name',
    },
    {
      title: t('receivables:columns.dueDate'),
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      render: (value: string) =>
        value ? value.split('-').reverse().join('.') : '',
    },
    {
      title: t('receivables:columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (value: ReceivablesStatusEnum) => (
        <Tag color={ROW_TO_TAG_STATUS_MAP[value]}>{value}</Tag>
      ),
    },
    {
      title: (
        <HeadCellSort
          isActive={
            currentSort?.sort ===
            api__v1__receivables__pagination__CursorFields.AMOUNT
          }
          title={t('receivables:columns.amount')}
          onChangeOrder={(order: SortOrderEnum | null) =>
            onChangeSort(
              api__v1__receivables__pagination__CursorFields.AMOUNT,
              order
            )
          }
        />
      ),
      dataIndex: 'total_amount',
      key: 'total_amount',
      // @ts-ignore
      render: (value: number | undefined, record: ReceivableResponse) =>
        value ? formatter(record.currency).format(value) : '',
    },
  ],
  [ReceivablesReceivableType.CREDIT_NOTE]: [
    {
      title: t('receivables:columns.number'),
      dataIndex: 'document_id',
      key: 'document_id',
    },
    {
      title: t('receivables:columns.issueDate'),
      dataIndex: 'issue_date',
      key: 'issue_date',
      render: (value: string) =>
        value ? format(new Date(value), 'dd.MM.yyyy') : '',
    },
    {
      title: t('receivables:columns.customer'),
      dataIndex: 'counterpart_name',
      key: 'counterpart_name',
    },
    {
      title: t('receivables:columns.dueDate'),
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      render: (value: string) =>
        value ? value.split('-').reverse().join('.') : '',
    },
    {
      title: t('receivables:columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (value: ReceivablesStatusEnum) => (
        <Tag color={ROW_TO_TAG_STATUS_MAP[value]}>{value}</Tag>
      ),
    },
    {
      title: (
        <HeadCellSort
          isActive={
            currentSort?.sort ===
            api__v1__receivables__pagination__CursorFields.AMOUNT
          }
          title={t('receivables:columns.amount')}
          onChangeOrder={(order: SortOrderEnum | null) =>
            onChangeSort(
              api__v1__receivables__pagination__CursorFields.AMOUNT,
              order
            )
          }
        />
      ),
      dataIndex: 'total_amount',
      key: 'total_amount',
      // @ts-ignore
      render: (value: number | undefined, record: ReceivableResponse) =>
        value ? formatter(record.currency).format(value) : '',
    },
  ],
});

const ReceivableTypeTab = ({
  type,
  currentFilters,
  onChangeSort: onChangeSortCallback,
}: Props) => {
  const { t } = useComponentsContext();

  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [currentSort, setCurrentSort] = useState<Sort | null>(null);

  const {
    data: receivables,
    isLoading,
    isRefetching,
  } = useReceivables(
    MONITE_ENTITY_ID,
    currentSort
      ? (currentSort.order as unknown as ReceivablesOrderEnum)
      : undefined,
    PAGE_LIMIT,
    currentPaginationToken || undefined,
    currentSort ? currentSort.sort : undefined,
    type,
    undefined,
    currentFilters[FILTER_TYPE_SEARCH] || undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    currentFilters[FILTER_TYPE_CUSTOMER] || undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    currentFilters[FILTER_TYPE_STATUS] || undefined
  );

  useEffect(() => {
    setCurrentSort(null);
    onChangeSortCallback && onChangeSortCallback(null);
  }, [type]);

  useEffect(() => {
    setCurrentPaginationToken(null);
  }, [currentFilters]);

  const onPrev = () =>
    setCurrentPaginationToken(receivables?.prev_pagination_token || null);

  const onNext = () =>
    setCurrentPaginationToken(receivables?.next_pagination_token || null);

  const onChangeSort = (
    sort: api__v1__receivables__pagination__CursorFields,
    order: SortOrderEnum | null
  ) => {
    setCurrentPaginationToken(null);
    if (order) {
      setCurrentSort({
        sort,
        order,
      });

      onChangeSortCallback && onChangeSortCallback({ sort, order });
    } else if (currentSort?.sort === sort && order === null) {
      setCurrentSort(null);

      onChangeSortCallback && onChangeSortCallback(null);
    }
  };

  const columns = mapTypeToColumns(t, currentSort, onChangeSort)[type];

  return (
    <Styled.Table>
      <Table
        loading={isLoading || isRefetching}
        rowKey="id"
        // @ts-ignore
        columns={columns}
        data={receivables?.data}
        scroll={{ y: 'auto' }}
        footer={() => (
          <TableFooter>
            <Button
              variant="contained"
              color="secondary"
              onClick={onPrev}
              disabled={!receivables?.prev_pagination_token}
            >
              <UArrowLeft width={24} height={24} />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={onNext}
              disabled={!receivables?.next_pagination_token}
            >
              <UArrowRight width={24} height={24} />
            </Button>
          </TableFooter>
        )}
      />
    </Styled.Table>
  );
};

export default ReceivableTypeTab;
