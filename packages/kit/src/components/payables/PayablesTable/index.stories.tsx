import Table from './Table';
import TestData from '../fixtures/list';

const Story = {
  title: 'PayableTable',
  component: Table,
};
export default Story;

export const DefaultTable = () => (
  <div style={{ display: 'flex', height: 400 }}>
    <Table
      data={TestData}
      onRowClick={() => {}}
      paginationTokens={{
        next_pagination_token: null,
        prev_pagination_token: null,
      }}
      currentSort={{
        sort: null,
        order: null,
      }}
      onChangeSort={() => {}}
      onChangeFilter={(field, value) => {
        console.log({ field, value });
      }}
    />
  </div>
);
