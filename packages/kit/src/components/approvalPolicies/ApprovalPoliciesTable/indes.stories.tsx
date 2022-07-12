import Table from './Table';
import TestData from '../fixtures/list';

const Story = {
  title: 'Approval Policies Table',
  component: Table,
};
export default Story;

export const DefaultTable = () => (
  <>
    <Table data={TestData.data} />
  </>
);
