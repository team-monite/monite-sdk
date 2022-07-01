import React from 'react';
import { Table } from '@monite/ui';
import { PayableResponseSchema } from '@monite/js-sdk';

import { useComponentsContext } from 'core/context/ComponentsContext';

import * as Styled from './styles';
import Row from './Row';

export interface PayablesTableProps {
  data?: PayableResponseSchema[];
}

const PayablesTable = ({ data }: PayablesTableProps) => {
  const { t } = useComponentsContext();

  return (
    <Styled.Table>
      <Table>
        <thead>
          <tr>
            <th>{t('payables:columns.number')}</th>
            <th>{t('payables:columns.supplier')}</th>
            <th>{t('payables:columns.issueDate')}</th>
            <th>{t('payables:columns.dueDate')}</th>
            <th>{t('payables:columns.status')}</th>
            <th>{t('payables:columns.appliedPolicy')}</th>
            <th>{t('payables:columns.amount')}</th>
            <th>{t('payables:columns.addedBy')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(data || []).map((r: any) => (
            <Row row={r} />
          ))}
        </tbody>
      </Table>
    </Styled.Table>
  );
};

export default PayablesTable;
