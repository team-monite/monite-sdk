import React from 'react';

import Table from './Table';
import TestData from '../fixtures/list';

const Story = {
  title: 'PayableTable',
  component: Table,
};
export default Story;

export const DefaultTable = () => (
  <>
    <Table data={TestData} />
  </>
);
