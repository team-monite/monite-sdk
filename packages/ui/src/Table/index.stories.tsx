import Table from '.';
import Row from './Row';
import Cell from './Cell';
import DropdownItem from '../Dropdown/MenuItem';
import Button from '../Button';

const Story = {
  title: 'Components/Table.tsx',
  component: Table,
};
export default Story;

export const DefaultTable = () => (
  <div style={{ maxWidth: 400 }}>
    <Table>
      <Row>
        <Cell forHeader>Col1</Cell>
        <Cell forHeader>Col2</Cell>
        <Cell forHeader>Col3</Cell>
      </Row>
      <Row
        dropdownActions={() => (
          <>
            <DropdownItem>Link1</DropdownItem>
            <DropdownItem>Link2</DropdownItem>
          </>
        )}
      >
        <Cell>Cell1</Cell>
        <Cell>Cell2</Cell>
        <Cell>Cell3</Cell>
      </Row>
      <Row
        buttonActions={() => (
          <>
            <Button>Action1</Button>
            <Button>Action2</Button>
          </>
        )}
      >
        <Cell>Cell4</Cell>
        <Cell>Cell5</Cell>
        <Cell>Cell6</Cell>
      </Row>
      <Row
        dropdownActions={() => (
          <>
            <DropdownItem>test</DropdownItem>
          </>
        )}
        buttonActions={() => (
          <>
            <Button variant={'text'} color="grey" hover="hoverAction">
              Test
            </Button>
          </>
        )}
      >
        <Cell>Cell7</Cell>
        <Cell>Cell8</Cell>
        <Cell>Cell9</Cell>
      </Row>
    </Table>
  </div>
);
