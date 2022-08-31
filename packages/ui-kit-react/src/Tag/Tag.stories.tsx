import { ComponentStory } from '@storybook/react';

import Tag from '.';

import { UInfoCircle, UTimes } from '../unicons';
import Avatar from '../Avatar';
import { Flex } from '../Box';

const Story = {
  title: 'Data Display/Tag',
  component: Tag,
};
export default Story;

const Wrap = ({ children, ...props }) => (
  <Flex
    {...props}
    sx={{
      gap: 10,
      flexWrap: 'wrap',
      padding: '15px 0',
      width: '100%',
    }}
  >
    {children}
  </Flex>
);

const Template: ComponentStory<typeof Tag> = (args) => <Tag {...args} />;

export const DefaultTag = Template.bind({});
DefaultTag.args = {
  children: 'Default Tag',
};

export const Colors = () => {
  return (
    <Wrap>
      <Tag>Active</Tag>
      <Tag color="success">Success</Tag>
      <Tag color="warning">Warning</Tag>
      <Tag color="pending">Pending</Tag>
      <Tag color="disabled">Disabled</Tag>
      <Tag color="secondary">Archived</Tag>
      <Tag color="draft">Draft</Tag>
    </Wrap>
  );
};

export const ColorsWithIcons = () => {
  return (
    <Wrap>
      <Tag leftIcon={<UInfoCircle />}>Left Icon</Tag>
      <Tag leftIcon={<UInfoCircle />} color="success">
        Left Icon
      </Tag>
      <Tag rightIcon={<UInfoCircle />}>Right Icon</Tag>
      <Tag rightIcon={<UInfoCircle />} color="warning">
        Right Icon
      </Tag>
    </Wrap>
  );
};

export const WithAvatar = () => {
  return (
    <Wrap>
      <Tag avatar={<Avatar>Deutsche Bank</Avatar>} rightIcon={<UTimes />}>
        Deutsche Bank
      </Tag>
    </Wrap>
  );
};
