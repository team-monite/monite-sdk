import Search from '.';
import { action } from '@storybook/addon-actions';

const Story = {
  title: 'Data Input/Search',
  component: Search,
};
export default Story;

const defaultArgs = {
  placeholder: 'Search',
  isFilter: undefined,
  onSearch: action('onSearch'),
};

const Template = (args) => <Search {...args} />;

export const Playground = Template.bind({});

Playground.args = defaultArgs;

Playground.argTypes = {
  placeholder: {
    control: 'text',
  },
  isFilter: {
    control: 'boolean',
  },
};
