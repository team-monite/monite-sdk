import { ComponentStory } from '@storybook/react';

import { UUsersAlt } from '../unicons';
import Select from './Select';

const Story = {
  title: 'Data Input/Select',
  component: Select,
};

export default Story;

const options = [
  {
    label: 'Male',
    value: '1',
  },
  {
    label: 'Female',
    value: '2',
  },
];

const Template: ComponentStory<typeof Select> = (args) => (
  <div style={{ height: 200, width: 300 }}>
    <Select {...args} />
  </div>
);

export const DefaultSelect = Template.bind({});
DefaultSelect.args = {
  label: 'Default Select',
  options,
};

export const Filter = () => {
  return (
    <div style={{ height: 200, width: 300 }}>
      <Select options={options} isFilter isClearable placeholder="Filter" />
    </div>
  );
};

export const FilterWithIcon = () => {
  return (
    <div style={{ height: 200, width: 300 }}>
      <Select
        options={options}
        isFilter
        isClearable
        placeholder="Filter"
        leftIcon={() => <UUsersAlt width={24} />}
      />
    </div>
  );
};
