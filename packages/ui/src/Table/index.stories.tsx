import { Table } from './Table';
import { HeadCellSort } from './HeadCellSort';
import Button from '../Button';
import Select from '../Select/Select';
import DropdownItem from '../Dropdown/MenuItem';

const Story = {
  title: 'Data Display/Table',
  component: Table,
};
export default Story;

export const DefaultTable = () => (
  <div style={{ maxWidth: 500 }}>
    <Table
      columns={[
        {
          title: 'Col1',
          dataIndex: 'col1',
          key: 'col1',
        },
        {
          title: (
            <HeadCellSort
              title="Col2"
              onChangeOrder={(order) => console.log(order)}
            />
          ),
          dataIndex: 'col2',
          key: 'col2',
        },
        {
          title: 'Col3',
          dataIndex: 'col3',
          key: 'col3',
        },
        {
          title: '',
          dataIndex: 'action',
          key: 'action',
          render: (value) => {
            switch (value.type) {
              case 'select':
                return (
                  <Select
                    options={value.options}
                    isFilter
                    placeholder="Action"
                  />
                );
              case 'button':
                return <Button>{value.value}</Button>;
            }
          },
        },
      ]}
      data={[
        {
          id: 1,
          col1: 'Cell11',
          col2: 'Cell12',
          col3: 'Cell13',
          action: {
            type: 'select',
            options: [
              { label: 'link1', value: 1 },
              { label: 'link2', value: 2 },
            ],
          },
        },
        {
          id: 2,
          col1: 'Cell21',
          col2: 'Cell22',
          col3: 'Cell23',
          action: {
            type: 'button',
            value: 'Action1',
          },
        },
        {
          id: 3,
          col1: 'Cell31',
          col2: 'Cell32',
          col3: 'Cell33',
          action: {
            type: 'button',
            value: 'Action1',
          },
        },
      ]}
      dropdownActions={
        <>
          <DropdownItem onClick={() => {}}>Edit</DropdownItem>
          <DropdownItem onClick={() => {}}>Delete</DropdownItem>
        </>
      }
    />
  </div>
);
