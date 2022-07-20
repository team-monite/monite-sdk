import { ComponentStory } from '@storybook/react';

import Badge from '.';

import { UInfoCircle } from '../unicons';

const Story = {
  title: 'Components/Badge',
  component: Badge,
};
export default Story;

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />;

export const DefaultBadge = Template.bind({});
DefaultBadge.args = {
  text: 'Default Badge',
};

export const Colors = () => {
  return (
    <>
      <Badge text="Active" /> <Badge text="Success" color="success" />{' '}
      <Badge text="Warning" color="warning" />{' '}
      <Badge text="Pending" color="pending" />{' '}
      <Badge text="Disabled" color="disabled" />{' '}
      <Badge text="Archived" color="secondary" />{' '}
      <Badge text="Draft" color="draft" />{' '}
    </>
  );
};

export const ColorsWithIcons = () => {
  return (
    <>
      <Badge leftIcon={<UInfoCircle />} text="Left Icon" />{' '}
      <Badge leftIcon={<UInfoCircle />} text="Left Icon" color="success" />{' '}
      <Badge rightIcon={<UInfoCircle />} text="Right Icon" />{' '}
      <Badge rightIcon={<UInfoCircle />} text="Right Icon" color="warning" />
    </>
  );
};
