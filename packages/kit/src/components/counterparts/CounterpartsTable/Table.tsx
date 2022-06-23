import React from 'react';
import { Table } from '@monite/ui';
import { CounterpartResponse } from '@monite/js-sdk';

import { useComponentsContext } from '../../../core/context/ComponentsContext';

import * as Styled from './styles';
import Row from './Row';

export interface CounterpartsTableProps {
  data?: CounterpartResponse[];
}

const CounterpartsTable = ({ data }: CounterpartsTableProps) => {
  useComponentsContext();

  return (
    <Styled.Table>
      <Table>
        <thead>
          <tr>
            <th>Name, country, city</th>
            <th>Type</th>
            <th>Contact information</th>
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
