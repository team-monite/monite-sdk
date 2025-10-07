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

export const TablePaginationReversed: Story = {
  name: 'reversed layout',
  args: {
    paginationLayout: 'reversed',
    pageSizeOptions: [10, 20, 50, 100],
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

export const TablePaginationCentered: Story = {
  name: 'centered layout',
  args: {
    paginationLayout: 'centered',
    pageSizeOptions: [10, 20, 50, 100],
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

export const TablePaginationCustom: Story = {
  name: 'custom layout (navigation right, size left)',
  args: {
    paginationLayout: 'custom',
    navigationPosition: 'right',
    pageSizePosition: 'left',
    pageSizeOptions: [10, 20, 50, 100],
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

export const TablePaginationCustomBothLeft: Story = {
  name: 'custom layout (both on left)',
  args: {
    paginationLayout: 'custom',
    navigationPosition: 'left',
    pageSizePosition: 'left',
    pageSizeOptions: [10, 20, 50, 100],
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
