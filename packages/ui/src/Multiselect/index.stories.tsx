import { ComponentStory } from '@storybook/react';

import Multiselect from '.';
import Avatar from '../Avatar';

const options = [
  {
    label: 'Bird',
    value: 'bird',
    icon: (
      <Avatar src="https://upload.wikimedia.org/wikipedia/commons/6/63/Icon_Bird_512x512.png">
        bird
      </Avatar>
    ),
  },
  {
    label: 'Snake',
    value: 'snake',
    icon: (
      <Avatar src="https://cdn-icons-png.flaticon.com/512/1303/1303472.png">
        snake
      </Avatar>
    ),
  },
  {
    label: 'Dog',
    value: 'dog',
    icon: (
      <Avatar src="https://cdn-icons-png.flaticon.com/512/616/616554.png">
        dog
      </Avatar>
    ),
  },
  {
    label: 'Turtle',
    value: 'turtle',
  },
];

const Story = {
  title: 'Components/Multiselect',
  component: Multiselect,
};

export default Story;

const Template: ComponentStory<typeof Multiselect> = (args) => (
  <div style={{ height: 500, width: 400 }}>
    <Multiselect {...args} />
  </div>
);

export const DefaultMultiselect = Template.bind({});
DefaultMultiselect.args = {
  options,
  optionAsTag: false,
};

DefaultMultiselect.argTypes = {
  optionAsTag: { control: 'boolean' },
};
