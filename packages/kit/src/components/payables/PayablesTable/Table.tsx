import React from 'react';
import { Table, HeadCellSort, Tag, TagColorType } from '@monite/ui';
import { PayableStateEnum, ReceivableResponse } from '@monite/js-sdk';

import { useComponentsContext } from 'core/context/ComponentsContext';

import * as Styled from './styles';

export interface PayablesTableProps {
  data?: ReceivableResponse[];
}

const ROW_TO_TAG_STATUS_MAP: Record<PayableStateEnum, TagColorType> = {
  [PayableStateEnum.NEW]: 'success',
  [PayableStateEnum.APPROVE_IN_PROGRESS]: 'pending',
  [PayableStateEnum.WAITING_TO_BE_PAID]: 'pending',
  [PayableStateEnum.PAID]: 'success',
  [PayableStateEnum.CANCELED]: 'warning',
  [PayableStateEnum.REJECTED]: 'warning',
};

const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

const PayablesTable = ({ data }: PayablesTableProps) => {
  const { t } = useComponentsContext();

  return (
    <Styled.Table>
      <Table
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
            dataIndex: 'issued_at',
            key: 'issued_at',
            render: (value: string) =>
              value ? value.split('-').reverse().join('.') : '',
          },
          {
            title: (
              <HeadCellSort
                title={t('payables:columns.dueDate')}
                onChangeOrder={(order) => console.log(order)}
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
                title={t('payables:columns.amount')}
                onChangeOrder={(order) => console.log(order)}
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
        scroll={{ y: 'auto' }}
        // footer={() => <div>test</div>}
      />
    </Styled.Table>
  );
};

export default PayablesTable;
