import React from 'react';

import Table from '.';
import Row from './Row';
import DropdownItem from '../Dropdown/MenuItem';
import Button from '../Button';

const Story = {
  title: 'Components/Table',
  component: Table,
};
export default Story;

export const DefaultTable = () => (
  <div style={{ maxWidth: 400 }}>
    <Table>
      <Row>
        <th>Col1</th>
        <th></th>
        <th>Col3</th>
      </Row>
      <Row
        dropdownActions={() => (
          <>
            <DropdownItem>Link1</DropdownItem>
            <DropdownItem>Link2</DropdownItem>
          </>
        )}
      >
        <td width={1}>Cell1</td>
        <td width={1}>Cell2</td>
        <td width={1}>Cell3</td>
      </Row>
      <Row
        buttonActions={() => (
          <>
            <Button text="Action1" />
            <Button text="Action2" />
          </>
        )}
      >
        <td width={1}>Cell4</td>
        <td width={1}>Cell5</td>
        <td width={1}>Cell6</td>
      </Row>
      <Row
        dropdownActions={() => (
          <>
            <DropdownItem>test</DropdownItem>
          </>
        )}
        buttonActions={() => (
          <>
            <Button noPadding color="grey" text="Test" hover="hoverAction" />
          </>
        )}
      >
        <td width={1}>Cell7</td>
        <td width={1}>Cell8</td>
        <td width={1}>Cell9</td>
      </Row>
    </Table>
  </div>
);
