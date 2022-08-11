import Table from './Table';
import TestData from '../fixtures/list';

const Story = {
  title: 'PayableTable',
  component: Table,
};
export default Story;

export const DefaultTable = () => (
  <div style={{ display: 'flex', height: 400 }}>
    <Table data={TestData} />
  </div>
);
