import { TablePagination as TablePaginationComponent } from './TablePagination';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof TablePaginationComponent> = {
  title: 'Components / TablePagination',
  component: TablePaginationComponent,
};

type Story = StoryObj<typeof TablePaginationComponent>;

export const TablePaginationDefault: Story = {
  name: 'default',
  args: {
    paginationModel: {
      pageSize: 10,
      page: 1,
    },
    onPaginationModelChange: () => {},
    nextPage: 2,
    prevPage: undefined,
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <div style={{ display: 'flex' }}>
        <TablePaginationComponent {...args} />
      </div>
    </div>
  ),
};

export const TablePaginationCustomized: Story = {
  name: 'props customization',
  args: {
    pageSizeOptions: [55, 10, 155, 200],
    paginationModel: {
      pageSize: 10,
      page: 1,
    },
    onPaginationModelChange: () => {},
    nextPage: 2,
    prevPage: undefined,
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <div style={{ display: 'flex' }}>
        <TablePaginationComponent {...args} />
      </div>
    </div>
  ),
};

export default meta;
