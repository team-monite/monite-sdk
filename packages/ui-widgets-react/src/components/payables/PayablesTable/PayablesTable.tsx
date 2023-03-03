import React, { useEffect, useState } from 'react';
import { formatISO, addDays, format } from 'date-fns';
import {
  PayableCursorFields,
  PayableResponseSchema,
  PayableStateEnum,
  ReceivableResponse,
} from '@team-monite/sdk-api';
import {
  Button,
  SortOrderEnum,
  Table,
  TableFooter,
  Tag,
  UArrowLeft,
  UArrowRight,
} from '@team-monite/ui-kit-react';

import { usePayable, usePayPayableById } from 'core/queries/usePayable';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { getReadableAmount } from 'core/utils';
import { default as FiltersComponent } from './Filters';
import { FilterTypes, FilterValue } from './types';
import { PAGE_LIMIT } from '../../../constants';
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
  onPay?: (id: string) => void;
  onChangeSort?: (params: {
    sort: PayableCursorFields;
    order: SortOrderEnum | null;
  }) => void;
  onChangeFilter?: (filter: {
    field: keyof FilterTypes;
    value: FilterValue;
  }) => void;
}

const PayablesTable = ({
  onRowClick,
  onPay,
  onChangeSort: onChangeSortCallback,
  onChangeFilter: onChangeFilterCallback,
}: Props) => {
  const { t } = useComponentsContext();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [currentFilter, setCurrentFilter] = useState<FilterTypes>({});

  const {
    data: payables,
    isLoading,
    isRefetching,
    refetch,
  } = usePayable(
    undefined,
    PAGE_LIMIT,
    currentPaginationToken || undefined,
    undefined,
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
  const payMutation = usePayPayableById();

  useEffect(() => {
    refetch();
  }, [currentPaginationToken, currentFilter]);

  const onPrev = () =>
    setCurrentPaginationToken(payables?.prev_pagination_token || null);

  const onNext = () =>
    setCurrentPaginationToken(payables?.next_pagination_token || null);

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
            title: t('payables:columns.dueDate'),
            dataIndex: 'due_date',
            key: 'due_date',
            render: (value: string) =>
              // TODO use date-fns
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
            title: t('payables:columns.amount'),
            dataIndex: 'amount',
            key: 'amount',
            render: (_, record) => {
              const payable = record as PayableResponseSchema;

              return payable.amount && payable.currency
                ? getReadableAmount(payable.amount, payable.currency)
                : '';
            },
          },
          {
            dataIndex: ['status', 'id'],
            key: 'pay',
            render: (_, record) => {
              const payable = record as PayableResponseSchema;

              if (payable.status !== PayableStateEnum.WAITING_TO_BE_PAID)
                return null;

              return (
                <Button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!payable) return;

                    await payMutation.mutateAsync(payable.id);
                    onPay && onPay(payable.id);
                  }}
                  variant={'link'}
                  isLoading={payMutation.isLoading}
                >
                  {t('common:pay')}
                </Button>
              );
            },
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
