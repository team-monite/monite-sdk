import { ComponentStory } from '@storybook/react';

import Multiselect from './Multiselect';

const options = [
  {
    label: 'Bird',
    value: 'bird',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Icon_Bird_512x512.png',
  },
  {
    label: 'Snake',
    value: 'snake',
    icon: 'https://cdn-icons-png.flaticon.com/512/1303/1303472.png',
  },
  {
    label: 'Dog',
    value: 'dog',
    icon: 'https://cdn-icons-png.flaticon.com/512/616/616554.png',
  },
  {
    label: 'Turtle',
    value: 'turtle',
  },
];

const Story = {
  title: 'Data Input/Multiselect',
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
