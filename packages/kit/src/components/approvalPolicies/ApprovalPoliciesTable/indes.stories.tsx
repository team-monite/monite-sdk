import Table from './Table';
import TestData from '../fixtures/list';

const Story = {
  title: 'In Progress/Approval Policies — Table View',
  component: Table,
};
export default Story;

export const DefaultTable = () => (
  <>
    <Table data={TestData.data} />
  </>
);
