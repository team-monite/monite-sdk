import React from 'react';
import { format } from 'date-fns';
import {
  Button,
  Table,
  HeadCellSort,
  Tag,
  UArrowLeft,
  UArrowRight,
  SortOrderEnum,
} from '@monite/ui';
import {
  api__v1__payables__pagination__CursorFields,
  PayableStateEnum,
  ReceivableResponse,
} from '@monite/js-sdk';

import { useComponentsContext } from 'core/context/ComponentsContext';

import Filters from './Filters';

import * as Styled from './styles';

import {
  PaginationTokens,
  Sort,
  Filters as FiltersType,
  FilterValue,
} from './types';
import { ROW_TO_TAG_STATUS_MAP } from '../consts';

export interface PayablesTableProps {
  loading?: boolean;
  data?: ReceivableResponse[];
  onRowClick: (id: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  paginationTokens: PaginationTokens;
  onChangeSort: (
    sort: api__v1__payables__pagination__CursorFields,
    order: SortOrderEnum | null
  ) => void;
  currentSort: Sort | null;
  onChangeFilter: (field: keyof FiltersType, value: FilterValue) => void;
}

const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

const PayablesTable = ({
  loading,
  data,
  onRowClick,
  onPrev,
  onNext,
  paginationTokens,
  onChangeSort,
  currentSort,
  onChangeFilter,
}: PayablesTableProps) => {
  const { t } = useComponentsContext();

  return (
    <Styled.Table>
      <Filters onChangeFilter={onChangeFilter} />
      <Table
        loading={loading}
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
          // {
          //   title: t('payables:columns.appliedPolicy'),
          //   dataIndex: 'applied_policy',
          //   key: 'applied_policy',
          //   render: (value: string) => value && <Tag>{value}</Tag>,
          // },
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
        data={data}
        onRow={(record) => ({
          onClick: () => onRowClick((record as ReceivableResponse).id),
        })}
        scroll={{ y: 'auto' }}
        // TODO create footer component and move to UI
        footer={() => (
          <Styled.Footer>
            <Button
              variant="contained"
              color="secondary"
              onClick={onPrev}
              disabled={!paginationTokens.prev_pagination_token}
            >
              <UArrowLeft width={24} height={24} />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={onNext}
              disabled={!paginationTokens.next_pagination_token}
            >
              <UArrowRight width={24} height={24} />
            </Button>
          </Styled.Footer>
        )}
      />
    </Styled.Table>
  );
};

export default PayablesTable;
