import Dropdown from '.';
import DropdownMenu from './Menu';
import DropdownItem from './MenuItem';

const Story = {
  title: 'Data Display/Dropdown Menu',
  component: Dropdown,
};
export default Story;

export const DefaultDropdownMenu = () => (
  <Dropdown>
    <DropdownMenu>
      <DropdownItem>Link1</DropdownItem>
      <DropdownItem>Link2</DropdownItem>
      <DropdownItem>Link3</DropdownItem>
    </DropdownMenu>
  </Dropdown>
);
