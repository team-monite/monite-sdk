import Table from './Table';
import CounterpartsTestData from '../fixtures/counterparts';

const Story = {
  title: 'CounterpartsTable',
  component: Table,
};
export default Story;

export const DefaultTable = () => (
  <>
    <Table data={CounterpartsTestData} />
  </>
);
