import React from 'react';
import { Table } from '@monite/ui';
import { CounterpartResponse } from '@monite/js-sdk';

import { useComponentsContext } from 'core/context/ComponentsContext';

import * as Styled from './styles';
import Row from './Row';

export interface CounterpartsTableProps {
  data?: CounterpartResponse[];
}

const CounterpartsTable = ({ data }: CounterpartsTableProps) => {
  const { t } = useComponentsContext();

  return (
    <Styled.Table>
      <Table>
        <thead>
          <tr>
            <th>{t('counterparts:columns.name')}</th>
            <th>{t('counterparts:columns.type')}</th>
            <th>{t('counterparts:columns.contacts')}</th>
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

export default CounterpartsTable;
