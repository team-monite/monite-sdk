import { Dropdown, DropdownMenuItem } from './';
import Button from '../Button';

const Story = {
  title: 'Data Display/Dropdown',
  component: Dropdown,
};
export default Story;

export const DefaultDropdown = () => (
  <Dropdown button={<Button type="submit">Open</Button>}>
    <DropdownMenuItem onClick={() => console.log('Link1')}>
      Link1
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => console.log('Link2')}>
      Link2
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => console.log('Link3')}>
      Link3
    </DropdownMenuItem>
  </Dropdown>
);
